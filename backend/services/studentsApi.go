package services

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/PrasadNaik1310/attendanceRegistration/models"
)

// gets the data from external API
func FetchStudentsFromAPI() ([]models.Student, error) {

	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	response, err := client.Get("https://lawbio.gdgmitwpu.tech/student")
	if err != nil {
		log.Printf("Error fetching students :-> %v", err)
		return nil, err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		log.Printf("Error parsing recived body %v", err)
		return nil, err
	}

	// First try to unmarshal as a slice directly
	var students []models.Student
	err = json.Unmarshal(body, &students)
	if err != nil {
		// If that fails, try to unmarshal as an object with a students field
		log.Printf("Direct unmarshal failed, trying to parse as object: %v", err)

		// Print the first 200 bytes of the response for debugging
		if len(body) > 200 {
			log.Printf("Response preview: %s...", body[:200])
		} else {
			log.Printf("Response: %s", body)
		}

		// Try to unmarshal as a response object with students field
		var response struct {
			Students []models.Student `json:"students"`
		}

		if err := json.Unmarshal(body, &response); err != nil || len(response.Students) == 0 {
			// If that also fails, try to unmarshal as a generic map to find the data
			var rawResponse map[string]interface{}
			if jsonErr := json.Unmarshal(body, &rawResponse); jsonErr != nil {
				log.Printf("Error :-> Could not unmarshal response as any known format: %v", jsonErr)
				return nil, jsonErr
			}

			// Look for an array field that might contain the students
			for key, value := range rawResponse {
				if arr, ok := value.([]interface{}); ok && len(arr) > 0 {
					log.Printf("Found array under key '%s', attempting to extract students", key)

					// Re-marshal this array and try to unmarshal as students
					if data, jsonErr := json.Marshal(arr); jsonErr == nil {
						var extractedStudents []models.Student
						if jsonErr := json.Unmarshal(data, &extractedStudents); jsonErr == nil {
							log.Printf("Successfully extracted %d students from field '%s'", len(extractedStudents), key)
							return extractedStudents, nil
						}
					}
				}
			}

			log.Printf("Error :-> Could not find students array in response")
			return nil, err
		}

		students = response.Students
	}

	log.Printf("Successfully parsed %d students from API", len(students))
	return students, nil

}

// syncs the fetched data to the db

func SyncAPIWithDb(dbSync func([]models.Student) error) error {
	students, err := FetchStudentsFromAPI()
	if err != nil {
		log.Printf("Could not fetch Student data : %v", err)
		return err
	}
	// dont update db if len(students) == 0
	if len(students) == 0 {
		log.Printf("No students returned in API response")
		log.Printf("Not updating DB")
		return nil
	}
	// sync with db
	if err := dbSync(students); err != nil {
		log.Printf("Not able to sync with DB: %v", err)
		return err
	}
	log.Printf("Synced %d students with DB", len(students))
	return nil
}
