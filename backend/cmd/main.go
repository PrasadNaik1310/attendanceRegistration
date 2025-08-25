package main

import (
	"context"
	"log"

	"github.com/PrasadNaik1310/attendanceRegistration/db"
	"github.com/PrasadNaik1310/attendanceRegistration/models"
	"github.com/PrasadNaik1310/attendanceRegistration/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	db.InitDB()
	defer db.CloseDB()

	app := fiber.New()

	// Add logger middleware
	app.Use(func(c *fiber.Ctx) error {
		log.Printf("Received %s request to %s", c.Method(), c.Path())
		return c.Next()
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Content-Length, Accept-Language, Accept-Encoding, Connection, Access-Control-Allow-Origin",
		AllowCredentials: false,
		ExposeHeaders:    "Content-Length, Content-Type",
	}))

	// Add OPTIONS handling for preflight requests
	app.Options("/*", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	app.Get("/api/students", func(c *fiber.Ctx) error {
		//call FetchStudentsFromAPI
		students, err := services.FetchStudentsFromAPI()
		if err != nil {
			log.Printf("Could not fetch Students from API : %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch students"})
		}
		if len(students) > 0 {
			return c.JSON(students)
		}
		return c.Status(404).JSON(fiber.Map{"error": "No students found"})
	})

	app.Post("/api/students", func(c *fiber.Ctx) error {
		var student models.Student
		if err := c.BodyParser(&student); err != nil {
			log.Println("Error parsing request body:", err)
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}
		collection := db.DB.Collection("students")
		_, err := collection.InsertOne(context.Background(), student)
		if err != nil {
			log.Println("Error inserting student:", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to add Student"})

		}
		log.Println("Student added successfully:", student)
		return c.Status(201).JSON(student)
	})

	app.Listen(":3001")
}
