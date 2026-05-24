import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI. Overrides the built-in error screen when provided. */
  fallback?: ReactNode;
  /** Called with the error and component stack whenever an error is caught. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Extracted as a functional component so it can use the useStyles hook
// (error boundaries must be class components and cannot use hooks directly)
const ErrorFallbackView = ({ error, onReset }: { error: Error | null; onReset: () => void }) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{error?.message ?? 'An unexpected error occurred.'}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Try again"
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Class-based React error boundary.
 *
 * Catches errors thrown during render / provider hydration and replaces the
 * crashed subtree with a safe fallback UI. Without this, a single AsyncStorage
 * read failure inside a context provider causes a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeProvider>...</SomeProvider>
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={<MyCustomErrorScreen />}>
 *     ...
 *   </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      return <ErrorFallbackView error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

const stylesheet = createStyleSheet(({ colors, typography }) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.card_typography,
  },
  message: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    color: colors.disable_text,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.accent,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: '600',
  },
}));

export { ErrorBoundary };
export type { ErrorBoundaryProps };
