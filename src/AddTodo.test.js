import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';
import { add } from 'date-fns';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component renders Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
  });




test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);

  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, {target: {value: "History Test"}})
  fireEvent.change(inputDate, {target: {value: "05/30/2030"}});
  fireEvent.click(addButton);

  fireEvent.change(inputTask, {target: {value: "History Test"}})
  fireEvent.change(inputDate, {target: {value: "05/30/2030"}});
  fireEvent.click(addButton);

  const tasks = screen.getAllByText(/History Test/i);
  expect(tasks.length).toBe(1);



 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);

  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i })

  fireEvent.change(inputDate, {target: {value: "05/30/2023"}});
  fireEvent.click(addButton)

  const tasks = screen.queryByText(/05\/30\/2023/i);
  expect(tasks).toBeNull();

 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);

  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const addButton = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, {target: {value: "Task Without Due Date"}})
  fireEvent.click(addButton);

  const task = screen.queryByText(/Task Without Due Date/i);
  expect(task).toBeNull();


 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);

  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, {target: {value: "Task to be Deleted"}});
  fireEvent.change(inputDate, {target: {value: "05/30/2023"}});
  fireEvent.click(addButton);

  const taskCheckbox = screen.getByRole('checkbox');
  fireEvent.click(taskCheckbox);

  const task = screen.queryByText(/Task to be Deleted/i);
  expect(task).toBeNull();


 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);

  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: "Late Task" } });
  fireEvent.change(inputDate, { target: { value: "05/30/2023" } });
  fireEvent.click(addButton);

  const taskCard = screen.getByTestId(/Late Task/i);
  expect(taskCard.style.backgroundColor).not.toBe('white');


 });
