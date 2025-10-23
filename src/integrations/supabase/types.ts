export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analysis_reports: {
        Row: {
          advantages: Json | null
          created_at: string
          description_score: number | null
          drawbacks: Json | null
          id: string
          recommendations: Json | null
          retention_score: number | null
          tags_score: number | null
          thumbnail_score: number | null
          title_score: number | null
          user_id: string
          video_url: string
        }
        Insert: {
          advantages?: Json | null
          created_at?: string
          description_score?: number | null
          drawbacks?: Json | null
          id?: string
          recommendations?: Json | null
          retention_score?: number | null
          tags_score?: number | null
          thumbnail_score?: number | null
          title_score?: number | null
          user_id: string
          video_url: string
        }
        Update: {
          advantages?: Json | null
          created_at?: string
          description_score?: number | null
          drawbacks?: Json | null
          id?: string
          recommendations?: Json | null
          retention_score?: number | null
          tags_score?: number | null
          thumbnail_score?: number | null
          title_score?: number | null
          user_id?: string
          video_url?: string
        }
        Relationships: []
      }
      beginner_examples: {
        Row: {
          category: string | null
          channel_subscribers: number | null
          created_at: string
          description_score: number | null
          id: string
          notes: string | null
          retention_score: number | null
          tags_score: number | null
          thumbnail_score: number | null
          title: string
          title_score: number | null
          video_id: string
        }
        Insert: {
          category?: string | null
          channel_subscribers?: number | null
          created_at?: string
          description_score?: number | null
          id?: string
          notes?: string | null
          retention_score?: number | null
          tags_score?: number | null
          thumbnail_score?: number | null
          title: string
          title_score?: number | null
          video_id: string
        }
        Update: {
          category?: string | null
          channel_subscribers?: number | null
          created_at?: string
          description_score?: number | null
          id?: string
          notes?: string | null
          retention_score?: number | null
          tags_score?: number | null
          thumbnail_score?: number | null
          title?: string
          title_score?: number | null
          video_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trending_videos: {
        Row: {
          category: string | null
          created_at: string
          id: string
          rank: number | null
          region: string | null
          trend_score: number | null
          trend_velocity: number | null
          trending_date: string
          video_analytics_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          rank?: number | null
          region?: string | null
          trend_score?: number | null
          trend_velocity?: number | null
          trending_date: string
          video_analytics_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          rank?: number | null
          region?: string | null
          trend_score?: number | null
          trend_velocity?: number | null
          trending_date?: string
          video_analytics_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trending_videos_video_analytics_id_fkey"
            columns: ["video_analytics_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_analytics: {
        Row: {
          avg_view_duration: number | null
          category: string | null
          channel_id: string | null
          channel_name: string | null
          comments: number | null
          created_at: string
          ctr: number | null
          engagement_rate: number | null
          id: string
          language: string | null
          likes: number | null
          published_at: string | null
          region: string | null
          shares: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_id: string
          views: number | null
        }
        Insert: {
          avg_view_duration?: number | null
          category?: string | null
          channel_id?: string | null
          channel_name?: string | null
          comments?: number | null
          created_at?: string
          ctr?: number | null
          engagement_rate?: number | null
          id?: string
          language?: string | null
          likes?: number | null
          published_at?: string | null
          region?: string | null
          shares?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_id: string
          views?: number | null
        }
        Update: {
          avg_view_duration?: number | null
          category?: string | null
          channel_id?: string | null
          channel_name?: string | null
          comments?: number | null
          created_at?: string
          ctr?: number | null
          engagement_rate?: number | null
          id?: string
          language?: string | null
          likes?: number | null
          published_at?: string | null
          region?: string | null
          shares?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_id?: string
          views?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "analyst" | "creator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "analyst", "creator"],
    },
  },
} as const
