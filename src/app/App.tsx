import { ThemeProvider } from '../contexts/ThemeContext';
import { Main } from './Main'

export default function App() {
  return (
      <ThemeProvider>
        <Main />
      </ThemeProvider>
  );
}
