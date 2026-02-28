import { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    SharedValue,
    AnimatedStyle,
} from 'react-native-reanimated';

const SPRING_CONFIG = {
    damping: 12,
    stiffness: 150,
    mass: 0.8,
};

const SPRING_SNAPPY = {
    damping: 15,
    stiffness: 200,
    mass: 0.6,
};

/**
 * Animated scale for press feedback on Pressable components.
 * Returns { scale, onPressIn, onPressOut, animatedStyle }.
 */
export const usePressAnimation = (scaleTo = 0.96) => {
    const scale = useSharedValue(1);

    const onPressIn = () => {
        'worklet';
        scale.value = withSpring(scaleTo, SPRING_SNAPPY);
    };

    const onPressOut = () => {
        'worklet';
        scale.value = withSpring(1, SPRING_CONFIG);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return { scale, onPressIn, onPressOut, animatedStyle };
};

/**
 * Fade-in animation with optional delay for staggering list items.
 * Returns { animatedStyle } that should be applied to an Animated.View.
 */
export const useFadeIn = (delay = 0, duration = 300) => {
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withDelay(
            delay,
            withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return { opacity, animatedStyle };
};

/**
 * Slide-in animation with optional delay.
 * Direction: 'up' | 'down' | 'left' | 'right'
 */
export const useSlideIn = (
    direction: 'up' | 'down' | 'left' | 'right' = 'up',
    delay = 0,
    distance = 20,
) => {
    const translateX = useSharedValue(
        direction === 'left' ? -distance : direction === 'right' ? distance : 0,
    );
    const translateY = useSharedValue(
        direction === 'up' ? distance : direction === 'down' ? -distance : 0,
    );
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
        translateX.value = withDelay(delay, withSpring(0, SPRING_CONFIG));
        translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIG));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    return { animatedStyle };
};

/**
 * Spring scale toggle — animates between 1.0 and target scale when active state changes.
 * Useful for capsule selection animations.
 */
export const useScaleSpring = (active: boolean, scaleTo = 0.95) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        if (active) {
            scale.value = withSequence(
                withSpring(scaleTo, SPRING_SNAPPY),
                withSpring(1, SPRING_CONFIG),
            );
        }
    }, [active]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return { scale, animatedStyle };
};

/**
 * Value change pulse — triggers a brief scale pulse when the watched value changes.
 */
export const useValuePulse = (value: string | number, scaleTo = 1.05) => {
    const scale = useSharedValue(1);
    const isFirstRender = useSharedValue(1);

    useEffect(() => {
        if (isFirstRender.value) {
            isFirstRender.value = 0;
            return;
        }
        scale.value = withSequence(
            withTiming(scaleTo, { duration: 100 }),
            withSpring(1, SPRING_CONFIG),
        );
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return { animatedStyle };
};

/**
 * Bounce animation — single bounce for icon feedback (e.g., bookmark save).
 */
export const useBounce = () => {
    const scale = useSharedValue(1);

    const trigger = () => {
        scale.value = withSequence(
            withSpring(1.3, SPRING_SNAPPY),
            withSpring(1, SPRING_CONFIG),
        );
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return { trigger, animatedStyle };
};

/**
 * Visibility animation — fade + scale for show/hide elements (e.g., scroll-to-top button).
 */
export const useVisibilityAnimation = (visible: boolean) => {
    const progress = useSharedValue(visible ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(visible ? 1 : 0, SPRING_CONFIG);
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [{ scale: 0.8 + progress.value * 0.2 }],
        pointerEvents: progress.value === 0 ? 'none' : 'auto',
    }));

    return { progress, animatedStyle };
};

/**
 * Modal entrance animation — scale + fade for alert-style modals.
 */
export const useModalEntrance = (visible: boolean) => {
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 200 });
            scale.value = withSpring(1, SPRING_CONFIG);
        } else {
            opacity.value = withTiming(0, { duration: 150 });
            scale.value = withTiming(0.9, { duration: 150 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return { animatedStyle, backdropStyle };
};

/**
 * Bottom sheet slide-up animation — translateY + fade for bottom sheet modals.
 */
export const useBottomSheetEntrance = (visible: boolean, height = 400) => {
    const translateY = useSharedValue(height);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 200 });
            translateY.value = withSpring(0, { damping: 20, stiffness: 150, mass: 0.8 });
        } else {
            opacity.value = withTiming(0, { duration: 150 });
            translateY.value = withTiming(height, { duration: 200 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return { animatedStyle, backdropStyle };
};
