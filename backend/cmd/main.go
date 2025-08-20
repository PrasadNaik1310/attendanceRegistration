package main

import (
	"context"

	"github.com/PrasadNaik1310/attendanceRegistration/db"
	"github.com/PrasadNaik1310/attendanceRegistration/models"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	db.InitDB()
	defer db.CloseDB()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET",
	}))

	app.Get("/api/students", func(c *fiber.Ctx) error {
		var students []models.Student
		collection := db.DB.Collection("students")
		cursor, err := collection.Find(context.Background(), bson.M{})
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch students"})
		}
		defer cursor.Close(context.Background())
		for cursor.Next(context.Background()) {
			var student models.Student
			if err := cursor.Decode(&student); err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to decode student"})
			}
			students = append(students, student)
		}
		return c.JSON(students)
	})

	app.Listen(":3001")
}
