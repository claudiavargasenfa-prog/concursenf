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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      exam_content_items: {
        Row: {
          audience: string
          body: string | null
          content_type: string
          created_at: string
          created_by: string | null
          exam_slug: string
          id: string
          published: boolean
          resource_url: string | null
          sort_order: number
          source_reference: string | null
          storage_path: string | null
          subject: string
          subject_id: string | null
          summary: string | null
          title: string
          topic: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          audience?: string
          body?: string | null
          content_type: string
          created_at?: string
          created_by?: string | null
          exam_slug?: string
          id?: string
          published?: boolean
          resource_url?: string | null
          sort_order?: number
          source_reference?: string | null
          storage_path?: string | null
          subject: string
          subject_id?: string | null
          summary?: string | null
          title: string
          topic: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string
          body?: string | null
          content_type?: string
          created_at?: string
          created_by?: string | null
          exam_slug?: string
          id?: string
          published?: boolean
          resource_url?: string | null
          sort_order?: number
          source_reference?: string | null
          storage_path?: string | null
          subject?: string
          subject_id?: string | null
          summary?: string | null
          title?: string
          topic?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_content_items_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "learning_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_content_items_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_flashcards: {
        Row: {
          audience: string
          back: string
          created_at: string
          created_by: string | null
          exam_slug: string
          front: string
          id: string
          published: boolean
          source_reference: string | null
          subject: string
          subject_id: string | null
          topic: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          audience?: string
          back: string
          created_at?: string
          created_by?: string | null
          exam_slug?: string
          front: string
          id?: string
          published?: boolean
          source_reference?: string | null
          subject: string
          subject_id?: string | null
          topic: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string
          back?: string
          created_at?: string
          created_by?: string | null
          exam_slug?: string
          front?: string
          id?: string
          published?: boolean
          source_reference?: string | null
          subject?: string
          subject_id?: string | null
          topic?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_flashcards_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "learning_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_flashcards_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_practice_history: {
        Row: {
          attempts: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exam_question_attempts: {
        Row: {
          created_at: string
          is_correct: boolean | null
          question_id: string
          selected_option: string
          subject_id: string | null
          topic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          is_correct?: boolean | null
          question_id: string
          selected_option: string
          subject_id?: string | null
          topic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          is_correct?: boolean | null
          question_id?: string
          selected_option?: string
          subject_id?: string | null
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_question_attempts_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "learning_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_question_attempts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_questions: {
        Row: {
          audience: string
          correct_option: string
          created_at: string
          created_by: string | null
          difficulty: string
          exam_slug: string
          explanation: string
          id: string
          options: Json
          published: boolean
          reference: string | null
          source_board: string | null
          source_year: number | null
          statement: string
          subject: string
          subject_id: string | null
          topic: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          audience?: string
          correct_option: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          exam_slug?: string
          explanation: string
          id?: string
          options: Json
          published?: boolean
          reference?: string | null
          source_board?: string | null
          source_year?: number | null
          statement: string
          subject: string
          subject_id?: string | null
          topic: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string
          correct_option?: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          exam_slug?: string
          explanation?: string
          id?: string
          options?: Json
          published?: boolean
          reference?: string | null
          source_board?: string | null
          source_year?: number | null
          statement?: string
          subject?: string
          subject_id?: string | null
          topic?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "learning_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_simulation_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          correct_answers: number
          id: string
          simulation_id: string
          started_at: string
          total_questions: number
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          correct_answers?: number
          id?: string
          simulation_id: string
          started_at?: string
          total_questions?: number
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          correct_answers?: number
          id?: string
          simulation_id?: string
          started_at?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_simulation_attempts_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "exam_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_simulation_questions: {
        Row: {
          position: number
          question_id: string
          simulation_id: string
        }
        Insert: {
          position?: number
          question_id: string
          simulation_id: string
        }
        Update: {
          position?: number
          question_id?: string
          simulation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_simulation_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_simulation_questions_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "exam_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_simulations: {
        Row: {
          audience: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          exam_slug: string
          id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          exam_slug: string
          id?: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          exam_slug?: string
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      exam_study_plans: {
        Row: {
          plan: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          plan?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          plan?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcard_reviews: {
        Row: {
          flashcard_id: string
          id: string
          next_review_at: string | null
          rating: number
          response_seconds: number | null
          reviewed_at: string
          user_id: string
        }
        Insert: {
          flashcard_id: string
          id?: string
          next_review_at?: string | null
          rating: number
          response_seconds?: number | null
          reviewed_at?: string
          user_id: string
        }
        Update: {
          flashcard_id?: string
          id?: string
          next_review_at?: string | null
          rating?: number
          response_seconds?: number | null
          reviewed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_reviews_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "exam_flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          confidence: number | null
          correct_answers: number
          id: string
          last_studied_at: string | null
          questions_answered: number
          status: string
          subject_id: string
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          correct_answers?: number
          id?: string
          last_studied_at?: string | null
          questions_answered?: number
          status?: string
          subject_id: string
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          correct_answers?: number
          id?: string
          last_studied_at?: string | null
          questions_answered?: number
          status?: string
          subject_id?: string
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_topic_subject_fk"
            columns: ["subject_id", "topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["subject_id", "id"]
          },
        ]
      }
      learning_subjects: {
        Row: {
          active: boolean
          created_at: string
          exam_slug: string
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          exam_slug: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          exam_slug?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      learning_topics: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          subject_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          subject_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "learning_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_areas: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      material_categories: {
        Row: {
          active: boolean
          area_id: string
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          area_id: string
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          area_id?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "material_categories_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "material_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      material_contests: {
        Row: {
          area_id: string
          board_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          municipality: string | null
          official_url: string | null
          organization_id: string | null
          published: boolean
          state: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          area_id: string
          board_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          municipality?: string | null
          official_url?: string | null
          organization_id?: string | null
          published?: boolean
          state?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          area_id?: string
          board_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          municipality?: string | null
          official_url?: string | null
          organization_id?: string | null
          published?: boolean
          state?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "material_contests_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "material_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_contests_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "organizing_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_contests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "material_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_contests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "material_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      material_documents: {
        Row: {
          contest_id: string
          created_at: string
          created_by: string | null
          description: string | null
          document_type: string
          file_name: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          published: boolean
          rights_status: string
          source_url: string | null
          storage_path: string | null
          title: string
        }
        Insert: {
          contest_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_type: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          published?: boolean
          rights_status: string
          source_url?: string | null
          storage_path?: string | null
          title: string
        }
        Update: {
          contest_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_type?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          published?: boolean
          rights_status?: string
          source_url?: string | null
          storage_path?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_documents_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "material_contests"
            referencedColumns: ["id"]
          },
        ]
      }
      material_organizations: {
        Row: {
          acronym: string | null
          created_at: string
          id: string
          municipality: string | null
          name: string
          official_url: string | null
          state: string | null
        }
        Insert: {
          acronym?: string | null
          created_at?: string
          id?: string
          municipality?: string | null
          name: string
          official_url?: string | null
          state?: string | null
        }
        Update: {
          acronym?: string | null
          created_at?: string
          id?: string
          municipality?: string | null
          name?: string
          official_url?: string | null
          state?: string | null
        }
        Relationships: []
      }
      organizing_boards: {
        Row: {
          acronym: string | null
          active: boolean
          created_at: string
          id: string
          name: string
          notes: string | null
          scope: string
          website_url: string | null
        }
        Insert: {
          acronym?: string | null
          active?: boolean
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          scope?: string
          website_url?: string | null
        }
        Update: {
          acronym?: string | null
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          scope?: string
          website_url?: string | null
        }
        Relationships: []
      }
      review_schedules: {
        Row: {
          completed_at: string | null
          created_at: string
          due_at: string
          id: string
          source_id: string | null
          source_type: string
          subject_id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_at: string
          id?: string
          source_id?: string | null
          source_type: string
          subject_id: string
          topic_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_at?: string
          id?: string
          source_id?: string | null
          source_type?: string
          subject_id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_schedules_topic_subject_fk"
            columns: ["subject_id", "topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["subject_id", "id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          activity_type: string
          completed: boolean
          completed_at: string | null
          duration_seconds: number
          id: string
          metadata: Json
          source_id: string | null
          started_at: string
          subject_id: string | null
          topic_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          completed?: boolean
          completed_at?: string | null
          duration_seconds?: number
          id?: string
          metadata?: Json
          source_id?: string | null
          started_at?: string
          subject_id?: string | null
          topic_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          completed?: boolean
          completed_at?: string | null
          duration_seconds?: number
          id?: string
          metadata?: Json
          source_id?: string | null
          started_at?: string
          subject_id?: string | null
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "learning_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_published_exam_questions: {
        Args: { p_exam_slug?: string }
        Returns: {
          audience: string
          difficulty: string
          id: string
          options: Json
          reference: string
          statement: string
          subject: string
          subject_id: string
          topic: string
          topic_id: string
        }[]
      }
      is_catalog_admin: { Args: never; Returns: boolean }
      submit_exam_question_answer: {
        Args: { p_question_id: string; p_selected_option: string }
        Returns: {
          correct_option: string
          explanation: string
          is_correct: boolean
          reference: string
        }[]
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
