// package main

// import (
// 	"encoding/json"
// 	"net/http"
// 	"sync"
// )

// type Todo struct {
//     ID   int    `json:"id"`
//     Task string `json:"task"`
// }

// var (
//     todos     []Todo
//     idCounter int
//     mu        sync.Mutex
// )

// func listTodos(w http.ResponseWriter, r *http.Request) {
//     mu.Lock()
//     defer mu.Unlock()

//     w.Header().Set("Content-Type", "application/json")
//     json.NewEncoder(w).Encode(todos)
// }

// func addTodo(w http.ResponseWriter, r *http.Request) {
//     mu.Lock()
//     defer mu.Unlock()

//     var newTodo Todo
//     if err := json.NewDecoder(r.Body).Decode(&newTodo); err != nil {
//         http.Error(w, err.Error(), http.StatusBadRequest)
//         return
//     }

//     idCounter++
//     newTodo.ID = idCounter
//     todos = append(todos, newTodo)

//     w.Header().Set("Content-Type", "application/json")
//     json.NewEncoder(w).Encode(newTodo)
// }

// func main() {
//     http.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
//         if r.Method == http.MethodGet {
//             println("Received GET request")
//             listTodos(w, r)
//         } else if r.Method == http.MethodPost {
//             println("Received POST request")
//             addTodo(w, r)
//         } else {
//             println("Received unsupported request method")
//             http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
//         }
//     })

//     println("Server starting on :8080")
//     err := http.ListenAndServe(":8080", nil)
//     if err != nil {
//         println("Error starting server:", err)
//     }
// }

package main

import (
	"encoding/json"
	"net/http"
	"sync"
)

type Todo struct {
    ID   int    `json:"id"`
    Task string `json:"task"`
}

var (
    todos     []Todo
    idCounter int
    mu        sync.Mutex
)

func listTodos(w http.ResponseWriter, r *http.Request) {
    mu.Lock()
    defer mu.Unlock()

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(todos)
}

func addTodo(w http.ResponseWriter, r *http.Request) {
    mu.Lock()
    defer mu.Unlock()

    var newTodo Todo
    if err := json.NewDecoder(r.Body).Decode(&newTodo); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    idCounter++
    newTodo.ID = idCounter
    todos = append(todos, newTodo)

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(newTodo); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}


func enableCors(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if r.Method == "OPTIONS" {
            return
        }
        next.ServeHTTP(w, r)
    })
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
        if r.Method == http.MethodGet {
            listTodos(w, r)
        } else if r.Method == http.MethodPost {
            addTodo(w, r)
        } else {
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        }
    })

    println("Server starting on :8080")
    err := http.ListenAndServe(":8080", enableCors(mux))
    if err != nil {
        println("Error starting server:", err)
    }
}
