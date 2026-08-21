import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "../components/tasks/TaskCard";
import type { Task } from "../types/task";

// TaskCard renders a Next.js <Link>, which needs the app router context
// in tests - mock it down to a plain anchor since we're not testing
// Next's routing behaviour here.
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return <a href={href}>{children}</a>;
  };
});

const baseTask: Task = {
  id: "task-1",
  title: "Inspect the roof",
  description: "Check for storm damage before the next front comes through",
  status: "PENDING",
  priority: "HIGH",
  dueDate: null,
  location: "Hyderabad",
  attachmentUrl: null,
  attachmentName: null,
  weather: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("TaskCard", () => {
  it("renders the title, description, priority, and location", () => {
    render(
      <TaskCard task={baseTask} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getByText("Inspect the roof")).toBeInTheDocument();
    expect(screen.getByText(/Check for storm damage/)).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("Hyderabad")).toBeInTheDocument();
  });

  it("calls onEdit with the task when the edit button is clicked", () => {
    const onEdit = jest.fn();
    render(<TaskCard task={baseTask} onEdit={onEdit} onDelete={jest.fn()} />);

    fireEvent.click(screen.getByLabelText("Edit task"));
    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it("calls onDelete with the task when the delete button is clicked", () => {
    const onDelete = jest.fn();
    render(<TaskCard task={baseTask} onEdit={jest.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByLabelText("Delete task"));
    expect(onDelete).toHaveBeenCalledWith(baseTask);
  });

  it("renders a weather badge when weather data is present", () => {
    render(
      <TaskCard
        task={{
          ...baseTask,
          weather: {
            tempC: 28,
            feelsLikeC: 30,
            description: "clear sky",
            icon: "01d",
            cityName: "Hyderabad",
          },
        }}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText(/28°C, clear sky/)).toBeInTheDocument();
  });
});
