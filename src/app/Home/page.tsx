"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil1Icon, TrashIcon, StarIcon } from "@radix-ui/react-icons";
import { useState, FormEvent, ChangeEvent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Todo {
  text: string;
  important: boolean;
}

export default function Home() {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [updateIndex, setUpdateIndex] = useState<number | null>(null);
  const [updateTodo, setUpdateTodo] = useState<string>("");
  const [tab, setTab] = useState<string>("all");

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo.trim() === "") {
      setIsDialogOpen(true);
      return;
    }
    setTodos([...todos, { text: todo.trim(), important: false }]);
    setTodo("");
  }
console.log("todos", todos)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const handleDeleteTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleUpdateClick = (index: number) => {
    setUpdateIndex(index);
    setUpdateTodo(todos[index].text);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateTodo(e.target.value);
  };

  const handleUpdateSave = () => {
    if (updateIndex !== null && updateTodo.trim() !== "") {
      const updatedTodos = todos.map((todo, i) =>
        i === updateIndex ? { ...todo, text: updateTodo.trim() } : todo
      );
      setTodos(updatedTodos);
      setIsUpdateDialogOpen(false);
      setUpdateIndex(null);
      setUpdateTodo("");
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  const handleToggleImportant = (index: number) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, important: !todo.important } : todo
    );
    setTodos(updatedTodos);
  };

  const filteredTodos =
    tab === "important"
      ? todos.filter((todo) => todo.important)
      : tab === "others"
      ? todos.filter((todo) => !todo.important)
      : todos;

  return (
    <main className="flex flex-col justify-center items-center py-10 bg-gray-50">
      <h1 className="text-3xl font-bold my-5 text-gray-900">
        Todo Application
      </h1>
      <div className="flex flex-col items-center w-full max-w-3xl gap-4">
        <form className="flex w-full gap-2" onSubmit={handleAddTodo}>
          <Input
            className="flex-grow border-2 border-gray-300 rounded-lg p-2"
            placeholder="Enter your todo. e.g: I'll have a fried egg for breakfast..."
            onChange={handleInputChange}
            value={todo}
          />
          <Button type="submit" className="text-white rounded-lg px-4 py-2">
            Add Todo
          </Button>
        </form>
        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All Todos</TabsTrigger>
            <TabsTrigger value="important">Important Todos</TabsTrigger>
            <TabsTrigger value="others">Other Todos</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TodoList
              todos={filteredTodos}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateClick={handleUpdateClick}
              handleToggleImportant={handleToggleImportant}
            />
          </TabsContent>
          <TabsContent value="important">
            <TodoList
              todos={filteredTodos}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateClick={handleUpdateClick}
              handleToggleImportant={handleToggleImportant}
            />
          </TabsContent>
          <TabsContent value="others">
            <TodoList
              todos={filteredTodos}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateClick={handleUpdateClick}
              handleToggleImportant={handleToggleImportant}
            />
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Input Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter a todo item before submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDialog}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Update your todo item below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            className="border-2 border-gray-300 rounded-lg p-2"
            placeholder="Update your todo"
            onChange={handleUpdateInputChange}
            value={updateTodo}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseUpdateDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateSave}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

interface TodoListProps {
  todos: Todo[];
  handleDeleteTodo: (index: number) => void;
  handleUpdateClick: (index: number) => void;
  handleToggleImportant: (index: number) => void;
}

function TodoList({
  todos,
  handleDeleteTodo,
  handleUpdateClick,
  handleToggleImportant,
}: TodoListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo, index) => (
        <li
          className="flex justify-between items-center p-2 border border-gray-300 rounded-lg bg-white"
          key={index}
        >
          <span>{todo.text}</span>
          <div className="flex gap-1">
            <Button
              size="icon"
              className={`text-xs ${
                todo.important ? "bg-yellow-500" : "bg-gray-500"
              } hover:bg-yellow-400 text-white p-1`}
              aria-label={`Mark ${todo.text} as important`}
              onClick={() => handleToggleImportant(index)}
            >
              <StarIcon />
            </Button>
            <Button
              size="icon"
              className="text-xs bg-red-600 hover:bg-red-500 text-white p-1"
              aria-label={`Delete ${todo.text}`}
              onClick={() => handleDeleteTodo(index)}
            >
              <TrashIcon />
            </Button>
            <Button
              size="icon"
              className="text-xs bg-green-600 hover:bg-green-500 text-white p-1"
              onClick={() => handleUpdateClick(index)}
            >
              <Pencil1Icon />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
