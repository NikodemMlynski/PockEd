import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/config/constants";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";

type FormData = {
  learning_style: string[];
  personality: Record<string, number>;
  motivation_rules: string[];
  top_intelligences: string[];
  social_focus: string[];
  communication_style: string[];
  goals: string;
};
type RequestData = {
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
    setValue,
  } = useForm<FormData>();
  const {token} = useAuth();

  const [learningStyle, setLearningStyle] = React.useState<string[]>([]);
  const [motivationRules, setMotivationRules] = React.useState<string[]>([]);
  const [topIntelligences, setTopIntelligences] = React.useState<string[]>([]);
  const [socialFocusState, setSocialFocusState] = React.useState<string[]>([]);
  const [communicationStyle, setCommunicationStyle] = React.useState<string[]>([]);

  const toggleOption = (option: string, list: string[], setter: any) => {
    if (list.includes(option)) {
      setter(list.filter((item) => item !== option));
    } else {
      setter([...list, option]);
    }
  };

  const validateNotEmpty = (value: string[]) =>
    value.length > 0 || "Zaznacz przynajmniej jedną odpowiedź.";

  const validateNumberField = (val: number | undefined) =>
    val !== undefined && !isNaN(val) ? true : "Wprowadź liczbę od 0 do 5.";

  const mutation = useMutation({
    mutationFn: async (data: RequestData) => {
      const res = await fetch(`${API_URL}/personality/update_user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      if(!res.ok) {
        const resData = await res.json();
        console.log(resData?.detail);
        throw new Error(resData?.detail);
      }
      return res.json();
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: any) => {
      toast.error("Coś sie zjebalo")
      console.log(error);
    }
  })

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      goals: data.goals.split(","),
      learning_style: learningStyle,
      motivation_rules: motivationRules,
      top_intelligences: topIntelligences,
      social_focus: socialFocusState,
      communication_style: communicationStyle,
    };
    mutation.mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto p-6 bg-white text-black rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-blue-600">Formularz Personalizacji</h2>

      {/* Styl uczenia się */}
      <div>
        <Label className="text-lg">Styl uczenia się</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {learningStyles.map((style) => (
            <label key={style} className="flex items-center gap-2">
              <Checkbox
                checked={learningStyle.includes(style)}
                onCheckedChange={() => toggleOption(style, learningStyle, setLearningStyle)}
              />
              {style}
            </label>
          ))}
        </div>
        <input
          type="hidden"
          {...register("learning_style", {
            validate: () => validateNotEmpty(learningStyle),
          })}
          value={JSON.stringify(learningStyle)}
        />
        {errors.learning_style && (
          <p className="text-red-500 text-sm">{errors.learning_style.message}</p>
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
                required: "To pole jest wymagane.",
                valueAsNumber: true,
                validate: validateNumberField,
              })}
              className="bg-blue-50"
            />
            {errors.personality?.[trait] && (
              <p className="text-red-500 text-sm">{errors.personality?.[trait]?.message}</p>
            )}
          </div>
        ))}
      </div>

      {/* Motywacja */}
      <div>
        <Label className="text-lg">Motywacja</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {motivations.map((m) => (
            <label key={m} className="flex items-center gap-2">
              <Checkbox
                checked={motivationRules.includes(m)}
                onCheckedChange={() => toggleOption(m, motivationRules, setMotivationRules)}
              />
              {m}
            </label>
          ))}
        </div>
        <input
          type="hidden"
          {...register("motivation_rules", {
            validate: () => validateNotEmpty(motivationRules),
          })}
          value={JSON.stringify(motivationRules)}
        />
        {errors.motivation_rules && (
          <p className="text-red-500 text-sm">{errors.motivation_rules.message}</p>
        )}
      </div>

      {/* Mocne strony */}
      <div>
        <Label className="text-lg">Mocne strony</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {intelligences.map((intel) => (
            <label key={intel} className="flex items-center gap-2">
              <Checkbox
                checked={topIntelligences.includes(intel)}
                onCheckedChange={() => toggleOption(intel, topIntelligences, setTopIntelligences)}
              />
              {intel}
            </label>
          ))}
        </div>
        <input
          type="hidden"
          {...register("top_intelligences", {
            validate: () => validateNotEmpty(topIntelligences),
          })}
          value={JSON.stringify(topIntelligences)}
        />
        {errors.top_intelligences && (
          <p className="text-red-500 text-sm">{errors.top_intelligences.message}</p>
        )}
      </div>

      {/* Społeczne wartości */}
      <div>
        <Label className="text-lg">Społeczne wartości</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {socialFocus.map((item) => (
            <label key={item} className="flex items-center gap-2">
              <Checkbox
                checked={socialFocusState.includes(item)}
                onCheckedChange={() => toggleOption(item, socialFocusState, setSocialFocusState)}
              />
              {item}
            </label>
          ))}
        </div>
        <input
          type="hidden"
          {...register("social_focus", {
            validate: () => validateNotEmpty(socialFocusState),
          })}
          value={JSON.stringify(socialFocusState)}
        />
        {errors.social_focus && (
          <p className="text-red-500 text-sm">{errors.social_focus.message}</p>
        )}
      </div>

      {/* Styl komunikacji */}
      <div>
        <Label className="text-lg">Styl komunikacji</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {communication.map((style) => (
            <label key={style} className="flex items-center gap-2">
              <Checkbox
                checked={communicationStyle.includes(style)}
                onCheckedChange={() =>
                  toggleOption(style, communicationStyle, setCommunicationStyle)
                }
              />
              {style}
            </label>
          ))}
        </div>
        <input
          type="hidden"
          {...register("communication_style", {
            validate: () => validateNotEmpty(communicationStyle),
          })}
          value={JSON.stringify(communicationStyle)}
        />
        {errors.communication_style && (
          <p className="text-red-500 text-sm">{errors.communication_style.message}</p>
        )}
      </div>

      {/* Cele */}
      <div>
        <Label className="text-lg">Twoje cele</Label>
        <Textarea
          placeholder="Np. programowanie, wolontariat..."
          className="bg-blue-50"
          {...register("goals", {
            validate: (val) => val.trim().length > 0 || "Wpisz przynajmniej jeden cel.",
          })}
        />
        {errors.goals && (
          <p className="text-red-500 text-sm">{errors.goals.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white">
          Zapisz profil
        </Button>
      </div>
    </form>
  );
}
