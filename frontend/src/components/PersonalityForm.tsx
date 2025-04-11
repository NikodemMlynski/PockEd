import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  learning_style: string[];
  personality: Record<string, number>;
  motivation_rules: string[];
  top_intelligences: string[];
  social_focus: string[];
  communication_style: string[];
  goals: string[];
};

const learningStyles = ["Wzrokowy", "Słuchowy", "Czytanie/Pisanie", "Kinestetyczny"];
const motivations = [
  "Proponuj zadania z wpływem społecznym.",
  "Autonomia wyboru",
  "Rywalizacja i rankingi",
  "Nagrody i odznaki",
];
const intelligences = [
  "Matematyczno-logiczna",
  "Językowa",
  "Wizualno-przestrzenna",
  "Muzyczna",
  "Interpersonalna",
  "Intrapersonalna",
  "Przyrodnicza",
  "Ruchowa",
];
const socialFocus = [
  "Ochrona środowiska",
  "Pomoc innym i wolontariat",
  "Rozwój technologii",
  "Sztuka i kultura",
];
const communication = [
  "Używaj przykładów z życia",
  "Dostarczaj szczegółowe instrukcje",
  "Krótkie powiadomienia głosowe",
];

export default function PersonalityForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const validateArray = (fieldName: keyof FormData) => {
    return () => {
      const value = getValues(fieldName);
      return value && value.length > 0 || "Zaznacz przynajmniej jedną odpowiedź.";
    };
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto p-6 bg-white text-black rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-blue-600">Formularz Personalizacji</h2>

      {/* Style uczenia się */}
      <div>
        <Label className="text-lg">Styl uczenia się</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {learningStyles.map((style) => (
            <label key={style} className="flex items-center gap-2">
              <Checkbox {...register("learning_style", { validate: validateArray("learning_style") })} value={style} />
              {style}
            </label>
          ))}
        </div>
        {errors.learning_style && (
          <p className="text-red-500 text-sm mt-1">{errors.learning_style.message}</p>
        )}
      </div>

      {/* Osobowość */}
      <div>
        <Label className="text-lg">Osobowość (0–5)</Label>
        {["Otwartość", "Sumienność", "Ekstrawersja", "Ugodowość", "Neurotyczność"].map((trait) => (
          <div key={trait} className="flex flex-col gap-1 mt-2">
            <Label>{trait}</Label>
            <Input
              type="number"
              min={0}
              max={5}
              {...register(`personality.${trait}` as const, {
                valueAsNumber: true,
              })}
              className="bg-blue-50"
            />
          </div>
        ))}
      </div>

      {/* Motywatory */}
      <div>
        <Label className="text-lg">Motywacja</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {motivations.map((m) => (
            <label key={m} className="flex items-center gap-2">
              <Checkbox {...register("motivation_rules", { validate: validateArray("motivation_rules") })} value={m} />
              {m}
            </label>
          ))}
        </div>
        {errors.motivation_rules && (
          <p className="text-red-500 text-sm mt-1">{errors.motivation_rules.message}</p>
        )}
      </div>

      {/* Inteligencje */}
      <div>
        <Label className="text-lg">Mocne strony</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {intelligences.map((intel) => (
            <label key={intel} className="flex items-center gap-2">
              <Checkbox {...register("top_intelligences", { validate: validateArray("top_intelligences") })} value={intel} />
              {intel}
            </label>
          ))}
        </div>
        {errors.top_intelligences && (
          <p className="text-red-500 text-sm mt-1">{errors.top_intelligences.message}</p>
        )}
      </div>

      {/* Społeczna orientacja */}
      <div>
        <Label className="text-lg">Społeczne wartości</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {socialFocus.map((item) => (
            <label key={item} className="flex items-center gap-2">
              <Checkbox {...register("social_focus", { validate: validateArray("social_focus") })} value={item} />
              {item}
            </label>
          ))}
        </div>
        {errors.social_focus && (
          <p className="text-red-500 text-sm mt-1">{errors.social_focus.message}</p>
        )}
      </div>

      {/* Styl komunikacji */}
      <div>
        <Label className="text-lg">Styl komunikacji</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {communication.map((style) => (
            <label key={style} className="flex items-center gap-2">
              <Checkbox {...register("communication_style", { validate: validateArray("communication_style") })} value={style} />
              {style}
            </label>
          ))}
        </div>
        {errors.communication_style && (
          <p className="text-red-500 text-sm mt-1">{errors.communication_style.message}</p>
        )}
      </div>

      {/* Cele */}
      <div>
        <Label className="text-lg">Twoje cele</Label>
        <Textarea
          {...register("goals", {
            validate: (val) => (val.length > 0 ? true : "Wpisz przynajmniej jeden cel."),
          })}
          placeholder="Np. programowanie, wolontariat..."
          className="bg-blue-50"
        />
        {errors.goals && (
          <p className="text-red-500 text-sm mt-1">{errors.goals.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
          Zapisz profil
        </Button>
      </div>
    </form>
  );
}
