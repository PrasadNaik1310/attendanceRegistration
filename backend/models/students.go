package models

type Student struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	PRN   string `json:"prn"`
	//Year          int    `json:"year"`

	FingerPrintID string `json:"fingerPrintId"`
}
