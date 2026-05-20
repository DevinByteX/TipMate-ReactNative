import { IndividualSplit } from '@/context/types';

/**
 * Pure function — no React dependency.
 * Returns a copy of the people array with default names filled in for
 * anyone whose name is blank, and calculatedAmount cleared.
 */
export function namedPeople(
    people: IndividualSplit[],
    t: (key: string, options?: Record<string, unknown>) => string,
): IndividualSplit[] {
    return people.map((person, index) => ({
        ...person,
        name: person.name.trim() || t('screens.customSplit.personDefault', { number: index + 1 }),
        calculatedAmount: undefined,
    }));
}
