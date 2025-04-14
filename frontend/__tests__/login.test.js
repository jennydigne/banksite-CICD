import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Login from '@/app/login/page'

jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));

describe("Login component", () => {
    it("renders login form", () => {
      render(<Login />);
      
      expect(screen.getByPlaceholderText("Användarnamn")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Lösenord")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Logga in" })).toBeInTheDocument();
    });
  });
