# Database Design

## Database Type

- PostgreSQL

## DBML

```sql
///////////////////////////////////////////////////////////
// USER & SESSION
///////////////////////////////////////////////////////////

Table users {
  id              text        [pk]
  name            text        [not null]
  email           text        [not null, unique]
  email_verified  boolean     [not null]
  image           text
  created_at      timestamp   [not null, default: `now()`]
  updated_at      timestamp   [not null, default: `now()`]
}

Table sessions {
  id          text        [pk]
  user_id     text        [not null, ref: > users.id]
  token       text        [not null]
  expires_at  timestamp   [not null]
  ip_address  text
  user_agent  text
  created_at  timestamp   [not null, default: `now()`]
  updated_at  timestamp   [not null, default: `now()`]

  Indexes {
    (user_id)
  }
}

Table accounts {
  id                          text        [pk]
  user_id                     text        [not null, ref: > users.id]
  account_id                  text        [not null]
  provider_id                 text        [not null]
  access_token                text
  refresh_token               text
  access_token_expires_at     timestamp
  refresh_token_expires_at    timestamp
  scope                       text
  id_token                    text
  password                    text
  created_at                  timestamp   [not null, default: `now()`]
  updated_at                  timestamp   [not null, default: `now()`]

  Indexes {
    (provider_id) [unique]
    (user_id)
  }
}

Table verifications {
  id          text        [pk]
  identifier  text        [not null]
  value       text        [not null]
  expires_at  timestamp   [not null]
  created_at  timestamp   [not null, default: `now()`]
  updated_at  timestamp   [not null, default: `now()`]

  Indexes {
    (identifier)
  }
}

///////////////////////////////////////////////////////////
// DOCUMENT WORKFLOW
///////////////////////////////////////////////////////////

Table documents {
  id            uuid        [pk, default: `gen_random_uuid()`]
  owner_id      text        [not null, ref: > users.id]
  title         text        [not null]
  description   text        [note: 'Document description']
  document_type text        [note: 'contract | nda | invoice | other']
  current_step  int         [not null, note: '1-4 workflow step']
  sub_step      int         [note: '1 or 2 for step 3 sub-steps']
  status        text        [not null, note: 'draft | signed']
  source_type   text        [note: "'upload' | 'blank'"]
  pdf_path      text        [note: 'Supabase Storage path for uploaded PDFs']
  current_content_id uuid       [unique, note: 'Reference to current content']
  current_pdf_id  uuid       [unique, note: 'Reference to original/unsigned PDF']
  signed_pdf_id   uuid       [unique, note: 'Reference to signed PDF (when signed)']
  created_at    timestamp   [not null, default: `now()`]
  updated_at    timestamp   [not null, default: `now()`]

  Indexes {
    (owner_id)
  }
}

Table document_contents {
  id            uuid        [pk, default: `gen_random_uuid()`]
  document_id   uuid        [not null, ref: > documents.id]
  html_content  text        [not null, note: 'Raw HTML content from TipTap editor']
  version       int         [default: 1]
  created_at    timestamp   [not null, default: `now()`]
  updated_at    timestamp   [not null, default: `now()`]

  Indexes {
    (document_id)
    (document_id, version) [unique]
  }
}

///////////////////////////////////////////////////////////
// PDF DOCUMENTS
///////////////////////////////////////////////////////////

Table document_pdfs {
  id          uuid        [pk, default: `gen_random_uuid()`]
  document_id  uuid        [not null, ref: > documents.id]
  pdf_path    text        [not null, note: 'Supabase Storage path']
  file_name   text        [not null]
  file_size   int         [not null]
  page_count  int         [note: 'Number of pages in PDF']
  status      text        [default: 'ready', note: "'ready' | 'signed'"]
  created_at  timestamp   [not null, default: `now()`]
  updated_at  timestamp   [not null, default: `now()`]

  Indexes {
    (document_id)
  }
}

///////////////////////////////////////////////////////////
// SIGNATURES
///////////////////////////////////////////////////////////

Table signatures {
  id              uuid        [pk, default: `gen_random_uuid()`]
  document_id     uuid        [not null, ref: > documents.id]
  document_pdf_id  uuid        [note: 'Reference to PDF']
  image_path      text        [not null]
  page_number     int         [not null]
  pos_x           float       [not null, note: 'PDF coordinates for embedding']
  pos_y           float       [not null, note: 'PDF coordinates for embedding']
  canvas_pos_x    float       [note: 'Canvas coordinates for display']
  canvas_pos_y    float       [note: 'Canvas coordinates for display']
  width           float       [not null]
  height          float       [not null]
  signer_name     text        [not null, note: 'Signer full name']
  signer_position text        [note: 'Job title or position']
  organization    text        [note: 'Organization or department']
  created_at      timestamp   [not null, default: `now()`]

  Indexes {
    (document_id)
    (document_pdf_id)
  }
}

///////////////////////////////////////////////////////////
// ENUMS (LOGICAL)
///////////////////////////////////////////////////////////
//
// DocumentStatus
// - draft
// - signed
//
```
