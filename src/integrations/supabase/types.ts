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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      available_jobs: {
        Row: {
          budget: string | null
          category: string | null
          client_member_since: string | null
          client_name: string | null
          created_at: string | null
          description: string | null
          distance: string | null
          id: string
          job_id: string | null
          time: string | null
          title: string
          urgent: boolean | null
        }
        Insert: {
          budget?: string | null
          category?: string | null
          client_member_since?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          distance?: string | null
          id?: string
          job_id?: string | null
          time?: string | null
          title: string
          urgent?: boolean | null
        }
        Update: {
          budget?: string | null
          category?: string | null
          client_member_since?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          distance?: string | null
          id?: string
          job_id?: string | null
          time?: string | null
          title?: string
          urgent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "available_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          last_message: string | null
          last_message_time: string | null
          name: string
          online: boolean | null
          unread: boolean | null
          updated_at: string | null
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          name: string
          online?: boolean | null
          unread?: boolean | null
          updated_at?: string | null
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          name?: string
          online?: boolean | null
          unread?: boolean | null
          updated_at?: string | null
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          amount: number | null
          budget: string | null
          category: string | null
          completed_date: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          offers_count: number | null
          payment_status: string | null
          points_earned: number | null
          rated: boolean | null
          rating: number | null
          status: string | null
          title: string
          updated_at: string | null
          urgency: string | null
          user_id: string
          vendor_id: string | null
          vendor_name: string | null
        }
        Insert: {
          amount?: number | null
          budget?: string | null
          category?: string | null
          completed_date?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          offers_count?: number | null
          payment_status?: string | null
          points_earned?: number | null
          rated?: boolean | null
          rating?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          urgency?: string | null
          user_id: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number | null
          budget?: string | null
          category?: string | null
          completed_date?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          offers_count?: number | null
          payment_status?: string | null
          points_earned?: number | null
          rated?: boolean | null
          rating?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          urgency?: string | null
          user_id?: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          id: string
          sender: string
          sent_at: string | null
          text: string
        }
        Insert: {
          conversation_id: string
          id?: string
          sender: string
          sent_at?: string | null
          text: string
        }
        Update: {
          conversation_id?: string
          id?: string
          sender?: string
          sent_at?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          message: string | null
          time: string | null
          title: string
          type: string | null
          unread: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          message?: string | null
          time?: string | null
          title: string
          type?: string | null
          unread?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          message?: string | null
          time?: string | null
          title?: string
          type?: string | null
          unread?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          member_since: string | null
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          member_since?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          member_since?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          created_at: string
          estimated_duration: string | null
          id: string
          job_id: string
          message: string | null
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          estimated_duration?: string | null
          id?: string
          job_id: string
          message?: string | null
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          estimated_duration?: string | null
          id?: string
          job_id?: string
          message?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          cashback_rate: number | null
          created_at: string | null
          id: string
          lifetime_points: number | null
          next_tier: string | null
          points: number | null
          points_to_next_tier: number | null
          streak: number | null
          tier: string | null
          tier_progress: number | null
          total_saved: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cashback_rate?: number | null
          created_at?: string | null
          id?: string
          lifetime_points?: number | null
          next_tier?: string | null
          points?: number | null
          points_to_next_tier?: number | null
          streak?: number | null
          tier?: string | null
          tier_progress?: number | null
          total_saved?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cashback_rate?: number | null
          created_at?: string | null
          id?: string
          lifetime_points?: number | null
          next_tier?: string | null
          points?: number | null
          points_to_next_tier?: number | null
          streak?: number | null
          tier?: string | null
          tier_progress?: number | null
          total_saved?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles: {
        Row: {
          bio: string | null
          business_name: string
          certifications: Json | null
          created_at: string | null
          id: string
          onboarding_completed: boolean | null
          onboarding_step: number | null
          portfolio: Json | null
          service_category: string | null
          skills: Json | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          business_name?: string
          certifications?: Json | null
          created_at?: string | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          portfolio?: Json | null
          service_category?: string | null
          skills?: Json | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          business_name?: string
          certifications?: Json | null
          created_at?: string | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          portfolio?: Json | null
          service_category?: string | null
          skills?: Json | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      vendor_stats: {
        Row: {
          completion_rate: number | null
          created_at: string | null
          id: string
          rating: number | null
          response_time: string | null
          reviews: number | null
          this_month_earnings: number | null
          this_month_jobs: number | null
          total_earnings: number | null
          total_jobs: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string | null
          id?: string
          rating?: number | null
          response_time?: string | null
          reviews?: number | null
          this_month_earnings?: number | null
          this_month_jobs?: number | null
          total_earnings?: number | null
          total_jobs?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_rate?: number | null
          created_at?: string | null
          id?: string
          rating?: number | null
          response_time?: string | null
          reviews?: number | null
          this_month_earnings?: number | null
          this_month_jobs?: number | null
          total_earnings?: number | null
          total_jobs?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          avatar: string | null
          avg_price: string | null
          completed_jobs: number | null
          completion_rate: number | null
          created_at: string | null
          distance: string | null
          favorite: boolean | null
          id: string
          last_job: string | null
          last_job_date: string | null
          name: string
          phone: string | null
          rating: number | null
          response_time: string | null
          reviews: number | null
          specialty: string | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          avatar?: string | null
          avg_price?: string | null
          completed_jobs?: number | null
          completion_rate?: number | null
          created_at?: string | null
          distance?: string | null
          favorite?: boolean | null
          id?: string
          last_job?: string | null
          last_job_date?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          response_time?: string | null
          reviews?: number | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          avatar?: string | null
          avg_price?: string | null
          completed_jobs?: number | null
          completion_rate?: number | null
          created_at?: string | null
          distance?: string | null
          favorite?: boolean | null
          id?: string
          last_job?: string | null
          last_job_date?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          response_time?: string | null
          reviews?: number | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
