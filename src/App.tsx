import { ThemeProvider } from './contexts/ThemeContext';
import { Main } from './screens/Main'

export default function App() {
  return (
      <ThemeProvider>
        <Main />
      </ThemeProvider>
  );
}
