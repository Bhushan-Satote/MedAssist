# Prescription API Routes Documentation

This document outlines the API routes for managing prescriptions in the MedAssist healthcare management system. These endpoints allow doctors to create, view, update, and delete prescriptions, while patients can view their own prescriptions. All routes are protected by API authentication and role-based access control.

## Base Information

- **Base URL**: `http://127.0.0.1:8000/api`
- **Authentication**: All endpoints require a Bearer token in the `Authorization` header.
  - Obtain the token by logging in via `POST /api/login`.
  - Example: `Authorization: Bearer {token}`
- **Content Type**: Requests and responses use JSON (`Accept: application/json`).

## Endpoints Overview

| Method | Endpoint                     | Role       | Description                          |
|--------|------------------------------|------------|--------------------------------------|
| POST   | `/prescriptions`            | Doctor     | Create a new prescription            |
| GET    | `/prescriptions/doctor`     | Doctor     | View prescriptions issued by the doctor |
| GET    | `/prescriptions/patient`    | Patient    | View prescriptions for the patient   |
| PUT    | `/prescriptions/{id}`       | Doctor     | Update an existing prescription      |
| DELETE | `/prescriptions/{id}`       | Doctor     | Delete a prescription                |

## 1. Create a New Prescription

### Description
Allows a doctor to create a new prescription for a patient.

### Endpoint
- **Method**: `POST`
- **URL**: `/prescriptions`

### Authentication
- **Required Role**: `doctor`
- **Header**:
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```

### Request Body
| Field         | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| `patient_id`  | Integer| Yes      | ID of the patient                    |
| `medication`  | String | Yes      | Name of the medication (max 255 chars) |
| `dosage`      | String | Yes      | Dosage instructions (max 100 chars)  |
| `frequency`   | String | Yes      | Frequency of intake (max 100 chars)  |
| `duration`    | String | Yes      | Duration of the prescription (max 100 chars) |
| `instructions`| String | No       | Additional instructions (max 1000 chars) |

**Example Request Body**:
```json
{
    "patient_id": 1,
    "medication": "Paracetamol",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "duration": "5 days",
    "instructions": "Take after meals"
}
```

### Responses
- **Success (201)**:
  ```json
  {
      "status": "success",
      "message": "Prescription created successfully",
      "data": {
          "id": 1,
          "doctor_id": 2,
          "patient_id": 1,
          "medication": "Paracetamol",
          "dosage": "500mg",
          "frequency": "Twice daily",
          "duration": "5 days",
          "instructions": "Take after meals",
          "status": "active",
          "created_at": "2025-05-19T18:00:00.000000Z",
          "updated_at": "2025-05-19T18:00:00.000000Z",
          "doctor": {
              "id": 2,
              "first_name": "Devanshi",
              "last_name": "Thummar",
              ...
          },
          "patient": {
              "id": 1,
              "first_name": "Jane",
              "last_name": "Doe",
              ...
          }
      }
  }
  ```
- **Error (403 - Unauthorized)**:
  ```json
  {
      "status": "error",
      "message": "Unauthorized: Only doctors can create prescriptions"
  }
  ```
- **Error (422 - Validation Failed)**:
  ```json
  {
      "status": "error",
      "message": "Validation failed",
      "errors": {
          "patient_id": ["The patient_id field is required."]
      }
  }
  ```

## 2. View Prescriptions Issued by a Doctor

### Description
Allows a doctor to view all prescriptions they have issued, paginated.

### Endpoint
- **Method**: `GET`
- **URL**: `/prescriptions/doctor`

### Authentication
- **Required Role**: `doctor`
- **Header**:
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```

### Query Parameters
| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `page`    | Integer| No       | Page number for pagination (default: 1) |

### Responses
- **Success (200)**:
  ```json
  {
      "status": "success",
      "data": {
          "current_page": 1,
          "data": [
              {
                  "id": 1,
                  "doctor_id": 2,
                  "patient_id": 1,
                  "medication": "Paracetamol",
                  "dosage": "500mg",
                  "frequency": "Twice daily",
                  "duration": "5 days",
                  "instructions": "Take after meals",
                  "status": "active",
                  "created_at": "2025-05-19T18:00:00.000000Z",
                  "updated_at": "2025-05-19T18:00:00.000000Z",
                  "doctor": {...},
                  "patient": {...}
              }
          ],
          "first_page_url": "http://127.0.0.1:8000/api/prescriptions/doctor?page=1",
          "from": 1,
          "last_page": 1,
          "last_page_url": "http://127.0.0.1:8000/api/prescriptions/doctor?page=1",
          "links": [...],
          "next_page_url": null,
          "path": "http://127.0.0.1:8000/api/prescriptions/doctor",
          "per_page": 10,
          "prev_page_url": null,
          "to": 1,
          "total": 1
      }
  }
  ```
- **Error (403 - Unauthorized)**:
  ```json
  {
      "status": "error",
      "message": "Unauthorized: Only doctors can view their prescriptions"
  }
  ```

## 3. View Prescriptions for a Patient

### Description
Allows a patient to view all prescriptions issued to them, paginated.

### Endpoint
- **Method**: `GET`
- **URL**: `/prescriptions/patient`

### Authentication
- **Required Role**: `patient`
- **Header**:
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```

### Query Parameters
| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `page`    | Integer| No       | Page number for pagination (default: 1) |

### Responses
- **Success (200)**:
  ```json
  {
      "status": "success",
      "data": {
          "current_page": 1,
          "data": [
              {
                  "id": 1,
                  "doctor_id": 2,
                  "patient_id": 1,
                  "medication": "Paracetamol",
                  "dosage": "500mg",
                  "frequency": "Twice daily",
                  "duration": "5 days",
                  "instructions": "Take after meals",
                  "status": "active",
                  "created_at": "2025-05-19T18:00:00.000000Z",
                  "updated_at": "2025-05-19T18:00:00.000000Z",
                  "doctor": {...},
                  "patient": {...}
              }
          ],
          "first_page_url": "http://127.0.0.1:8000/api/prescriptions/patient?page=1",
          "from": 1,
          "last_page": 1,
          "last_page_url": "http://127.0.0.1:8000/api/prescriptions/patient?page=1",
          "links": [...],
          "next_page_url": null,
          "path": "http://127.0.0.1:8000/api/prescriptions/patient",
          "per_page": 10,
          "prev_page_url": null,
          "to": 1,
          "total": 1
      }
  }
  ```
- **Error (403 - Unauthorized)**:
  ```json
  {
      "status": "error",
      "message": "Unauthorized: Only patients can view their prescriptions"
  }
  ```
- **Error (404 - Patient Not Found)**:
  ```json
  {
      "status": "error",
      "message": "Patient not found"
  }
  ```

## 4. Update an Existing Prescription

### Description
Allows a doctor to update an existing prescription they issued.

### Endpoint
- **Method**: `PUT`
- **URL**: `/prescriptions/{id}`

### Authentication
- **Required Role**: `doctor`
- **Header**:
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```

### URL Parameters
| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `id`      | Integer| Yes      | ID of the prescription   |

### Request Body
| Field         | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| `medication`  | String | No       | Name of the medication (max 255 chars) |
| `dosage`      | String | No       | Dosage instructions (max 100 chars)  |
| `frequency`   | String | No       | Frequency of intake (max 100 chars)  |
| `duration`    | String | No       | Duration of the prescription (max 100 chars) |
| `instructions`| String | No       | Additional instructions (max 1000 chars) |
| `status`      | String | No       | Status of the prescription (`active`, `expired`, `canceled`) |

**Example Request Body**:
```json
{
    "dosage": "1000mg",
    "instructions": "Take before meals",
    "status": "active"
}
```

### Responses
- **Success (200)**:
  ```json
  {
      "status": "success",
      "message": "Prescription updated successfully",
      "data": {
          "id": 1,
          "doctor_id": 2,
          "patient_id": 1,
          "medication": "Paracetamol",
          "dosage": "1000mg",
          "frequency": "Twice daily",
          "duration": "5 days",
          "instructions": "Take before meals",
          "status": "active",
          "created_at": "2025-05-19T18:00:00.000000Z",
          "updated_at": "2025-05-19T18:05:00.000000Z",
          "doctor": {...},
          "patient": {...}
      }
  }
  ```
- **Error (403 - Unauthorized)**:
  ```json
  {
      "status": "error",
      "message": "Unauthorized: Only doctors can update prescriptions"
  }
  ```
- **Error (404 - Not Found)**:
  ```json
  {
      "status": "error",
      "message": "Prescription not found",
      "error": "No query results for model [App\\Models\\Prescription] 1"
  }
  ```

## 5. Delete a Prescription

### Description
Allows a doctor to delete a prescription they issued.

### Endpoint
- **Method**: `DELETE`
- **URL**: `/prescriptions/{id}`

### Authentication
- **Required Role**: `doctor`
- **Header**:
  ```
  Authentication: Bearer {token}
  Accept: application/json
  ```

### URL Parameters
| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `id`      | Integer| Yes      | ID of the prescription   |

### Responses
- **Success (200)**:
  ```json
  {
      "status": "success",
      "message": "Prescription deleted successfully"
  }
  ```
- **Error (403 - Unauthorized)**:
  ```json
  {
      "status": "error",
      "message": "Unauthorized: Only doctors can delete prescriptions"
  }
  ```
- **Error (404 - Not Found)**:
  ```json
  {
      "status": "error",
      "message": "Prescription not found",
      "error": "No query results for model [App\\Models\\Prescription] 1"
  }
  ```

## Testing the Endpoints

### Prerequisites
- **Doctor User**:
  - Email: `devyanshi.thummar@gmail.com`
  - Password: `password`
  - Role: `doctor`
- **Patient User**:
  - Email: `patient@example.com`
  - Password: `password`
  - Role: `patient`
- **Database Setup**:
  - Ensure `users`, `doctors`, `patients`, and `prescriptions` tables are populated with test data.

### Steps
1. **Obtain Tokens**:
   - Log in as a doctor (`POST /api/login`) to get a doctor token.
   - Log in as a patient to get a patient token.
2. **Test Each Endpoint**:
   - Use Postman or cURL with the appropriate token and role.

## Notes
- All endpoints are protected by the `auth:api` middleware.
- Pagination is applied to `GET` endpoints (`/prescriptions/doctor` and `/prescriptions/patient`), returning 10 records per page.
- Error handling includes validation errors, unauthorized access, and not found scenarios.
- Logs are generated for errors (check `storage/logs/laravel.log` for debugging).