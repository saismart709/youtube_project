-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('admin', 'analyst', 'creator');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'creator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create video_analytics table
CREATE TABLE public.video_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_id TEXT,
  channel_name TEXT,
  category TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  views BIGINT DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  avg_view_duration INTEGER,
  ctr DECIMAL(5,2),
  thumbnail_url TEXT,
  tags TEXT[],
  language TEXT,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trending_videos table
CREATE TABLE public.trending_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_analytics_id UUID REFERENCES public.video_analytics(id) ON DELETE CASCADE,
  trend_score DECIMAL(5,2),
  trend_velocity DECIMAL(5,2),
  trending_date DATE NOT NULL,
  rank INTEGER,
  category TEXT,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create beginner_examples table
CREATE TABLE public.beginner_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_subscribers INTEGER,
  category TEXT,
  title_score INTEGER,
  thumbnail_score INTEGER,
  description_score INTEGER,
  tags_score INTEGER,
  retention_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create analysis_reports table
CREATE TABLE public.analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  title_score INTEGER,
  thumbnail_score INTEGER,
  description_score INTEGER,
  tags_score INTEGER,
  retention_score INTEGER,
  advantages JSONB,
  drawbacks JSONB,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beginner_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for video_analytics
CREATE POLICY "Anyone can view video analytics"
  ON public.video_analytics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and analysts can manage video analytics"
  ON public.video_analytics FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'analyst')
  );

-- RLS Policies for trending_videos
CREATE POLICY "Anyone can view trending videos"
  ON public.trending_videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and analysts can manage trending videos"
  ON public.trending_videos FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'analyst')
  );

-- RLS Policies for beginner_examples
CREATE POLICY "Anyone can view beginner examples"
  ON public.beginner_examples FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage beginner examples"
  ON public.beginner_examples FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for analysis_reports
CREATE POLICY "Users can view their own reports"
  ON public.analysis_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports"
  ON public.analysis_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reports"
  ON public.analysis_reports FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to automatically create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  );
  
  -- Assign default 'creator' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'creator');
  
  RETURN new;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_analytics_updated_at
  BEFORE UPDATE ON public.video_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_video_analytics_video_id ON public.video_analytics(video_id);
CREATE INDEX idx_video_analytics_category ON public.video_analytics(category);
CREATE INDEX idx_video_analytics_region ON public.video_analytics(region);
CREATE INDEX idx_trending_videos_date ON public.trending_videos(trending_date DESC);
CREATE INDEX idx_trending_videos_rank ON public.trending_videos(rank);
CREATE INDEX idx_analysis_reports_user_id ON public.analysis_reports(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
