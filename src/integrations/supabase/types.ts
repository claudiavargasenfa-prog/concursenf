export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]


type LearningTable<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
};

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      learning_subjects: LearningTable<
        { id: string; exam_slug: string; name: string; slug: string; sort_order: number; active: boolean; created_at: string; updated_at: string },
        { id?: string; exam_slug: string; name: string; slug: string; sort_order?: number; active?: boolean; created_at?: string; updated_at?: string }
      >;
      learning_topics: LearningTable<
        { id: string; subject_id: string; name: string; slug: string; description: string | null; sort_order: number; active: boolean; created_at: string; updated_at: string },
        { id?: string; subject_id: string; name: string; slug: string; description?: string | null; sort_order?: number; active?: boolean; created_at?: string; updated_at?: string }
      >;
      learning_progress: LearningTable<
        { id: string; user_id: string; subject_id: string; topic_id: string; status: string; confidence: number | null; questions_answered: number; correct_answers: number; last_studied_at: string | null; updated_at: string },
        { id?: string; user_id: string; subject_id: string; topic_id: string; status?: string; confidence?: number | null; questions_answered?: number; correct_answers?: number; last_studied_at?: string | null; updated_at?: string }
      >;
      study_sessions: LearningTable<
        { id: string; user_id: string; subject_id: string | null; topic_id: string | null; activity_type: string; source_id: string | null; duration_seconds: number; completed: boolean; metadata: Json; started_at: string; completed_at: string | null },
        { id?: string; user_id: string; subject_id?: string | null; topic_id?: string | null; activity_type: string; source_id?: string | null; duration_seconds?: number; completed?: boolean; metadata?: Json; started_at?: string; completed_at?: string | null }
      >;
      flashcard_reviews: LearningTable<
        { id: string; user_id: string; flashcard_id: string; rating: number; reviewed_at: string; next_review_at: string | null; response_seconds: number | null },
        { id?: string; user_id: string; flashcard_id: string; rating: number; reviewed_at?: string; next_review_at?: string | null; response_seconds?: number | null }
      >;
      review_schedules: LearningTable<
        { id: string; user_id: string; subject_id: string; topic_id: string; source_type: string; source_id: string | null; due_at: string; completed_at: string | null; created_at: string },
        { id?: string; user_id: string; subject_id: string; topic_id: string; source_type: string; source_id?: string | null; due_at: string; completed_at?: string | null; created_at?: string }
      >;
      exam_simulations: LearningTable<
        { id: string; exam_slug: string; title: string; description: string | null; audience: string; duration_minutes: number | null; published: boolean; created_at: string; updated_at: string },
        { id?: string; exam_slug: string; title: string; description?: string | null; audience?: string; duration_minutes?: number | null; published?: boolean; created_at?: string; updated_at?: string }
      >;
      exam_simulation_questions: LearningTable<
        { simulation_id: string; question_id: string; position: number },
        { simulation_id: string; question_id: string; position?: number }
      >;
      exam_simulation_attempts: LearningTable<
        { id: string; simulation_id: string; user_id: string; answers: Json; total_questions: number; correct_answers: number; started_at: string; completed_at: string | null },
        { id?: string; simulation_id: string; user_id: string; answers?: Json; total_questions?: number; correct_answers?: number; started_at?: string; completed_at?: string | null }
      >;
      exam_question_attempts: LearningTable<
        { user_id: string; question_id: string; selected_option: string; subject_id: string | null; topic_id: string | null; is_correct: boolean | null; created_at: string },
        { user_id: string; question_id: string; selected_option: string; subject_id?: string | null; topic_id?: string | null; is_correct?: boolean | null; created_at?: string }
      >;
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
          subject_id: string | null
          topic_id: string | null
          subject: string
          summary: string | null
          title: string
          topic: string
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
          subject_id?: string | null
          topic_id?: string | null
          subject: string
          summary?: string | null
          title: string
          topic: string
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
          subject_id?: string | null
          topic_id?: string | null
          subject?: string
          summary?: string | null
          title?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
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
          subject_id: string | null
          topic_id: string | null
          subject: string
          topic: string
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
          subject_id?: string | null
          topic_id?: string | null
          subject: string
          topic: string
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
          subject_id?: string | null
          topic_id?: string | null
          subject?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
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
          subject_id: string | null
          topic_id: string | null
          subject: string
          topic: string
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
          subject_id?: string | null
          topic_id?: string | null
          subject: string
          topic: string
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
          subject_id?: string | null
          topic_id?: string | null
          subject?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_published_exam_questions: {
        Args: { p_exam_slug?: string };
        Returns: { id: string; audience: string; subject: string; topic: string; difficulty: string; statement: string; options: Json; reference: string | null }[];
      };
      is_catalog_admin: { Args: never; Returns: boolean };
      submit_exam_question_answer: {
        Args: { p_question_id: string; p_selected_option: string };
        Returns: { is_correct: boolean; correct_option: string; explanation: string; reference: string | null }[];
      };
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
