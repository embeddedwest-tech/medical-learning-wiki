export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      entries: {
        Row: {
          id: string
          category: "herb" | "anatomy"
          created_at: number
          updated_at: number
          name: string
          properties: string
          efficacy: string
          components: string
          prescriptions: string
          notes: string
          subtype: "muscle" | "nerve" | "bone" | "vessel" | null
          location: string
          innervation: string
          function_text: string
          clinical: string
          image: string | null
        }
        Insert: {
          id: string
          category: "herb" | "anatomy"
          created_at: number
          updated_at: number
          name: string
          properties?: string
          efficacy?: string
          components?: string
          prescriptions?: string
          notes?: string
          subtype?: "muscle" | "nerve" | "bone" | "vessel" | null
          location?: string
          innervation?: string
          function_text?: string
          clinical?: string
          image?: string | null
        }
        Update: {
          id?: string
          category?: "herb" | "anatomy"
          created_at?: number
          updated_at?: number
          name?: string
          properties?: string
          efficacy?: string
          components?: string
          prescriptions?: string
          notes?: string
          subtype?: "muscle" | "nerve" | "bone" | "vessel" | null
          location?: string
          innervation?: string
          function_text?: string
          clinical?: string
          image?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type EntryRow = Database["public"]["Tables"]["entries"]["Row"]
export type EntryInsert = Database["public"]["Tables"]["entries"]["Insert"]
