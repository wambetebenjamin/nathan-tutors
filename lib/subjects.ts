import { SUBJECTS } from "./data";
import type { SubjectCategory } from "./types";

export function findSubjectCategory(name: string): SubjectCategory | undefined {
  const value = name.trim().toLowerCase();
  return (
    SUBJECTS.find((subject) => subject.name.toLowerCase() === value) ??
    SUBJECTS.find((subject) => value.includes(subject.name.toLowerCase()))
  );
}

export function subjectNames(): string[] {
  return SUBJECTS.map((subject) => subject.name);
}
