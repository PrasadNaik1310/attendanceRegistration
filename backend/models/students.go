package models

type Student struct {
	Name string `json:"name"`
	PRN  string `json:"prn"`
	Year int    `json:"year"`
}
