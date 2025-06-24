"use client";

import { useEffect, useState, useTransition } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { X } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { Group } from "@/lib/constants";
import { Question } from "@/lib/db/schemas";
import { cn } from "@/lib/utils";
import { changeQuestionOrderAction, deleteQuestionAction } from "../actions";

type QuestionsDndProps = {
  groupId: Group;
  questions: Array<Question>;
};

export const QuestionsDnd = ({ groupId, questions }: QuestionsDndProps) => {
  const [items, setItems] = useState(questions.sort((a, b) => a.order - b.order));
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  useEffect(() => {
    setItems(questions.sort((a, b) => a.order - b.order));
  }, [questions]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((q) => q.id === active.id);
    const newIndex = items.findIndex((q) => q.id === over?.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    const ids = newItems.map((q) => q.id);
    startTransition(async () => {
      await changeQuestionOrderAction(groupId, ids);
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((q) => q.id)} strategy={verticalListSortingStrategy}>
        <div suppressHydrationWarning>
          {items.map((question) => (
            <SortableItem
              key={question.id}
              question={question}
              isPending={isPending}
              onRemove={removeItem}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

type SortableItemProps = {
  question: Question;
  isPending: boolean;
  onRemove: (id: string) => void;
};

const SortableItem = ({ question, isPending, onRemove }: SortableItemProps) => {
  const { toast } = useToast();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteQuestion = async () => {
    const { result, message } = await deleteQuestionAction(question.id);
    if (result === "error") {
      toast({
        title: "Noe gikk galt",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Spørsmål slettet",
        description: message,
        variant: "default",
      });
      onRemove(question.id);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "input":
        return "Liten tekstboks";
      case "textarea":
        return "Stor tekstboks";
      case "checkbox":
        return "Avkryssingsbokser";
      case "select":
        return "Nedtrekksmeny";
      default:
        return type;
    }
  };

  const options = question.options ? JSON.parse(question.options) : [];

  return (
    <div
      className="bg-popover mb-4 flex items-center gap-4 rounded border p-4"
      style={style}
      suppressHydrationWarning
    >
      <div
        ref={setNodeRef}
        {...(isPending ? {} : attributes)}
        {...(isPending ? {} : listeners)}
        className={cn({
          "opacity-50": isPending,
          "cursor-grab": !isPending,
          "cursor-not-allowed": isPending,
        })}
      >
        <DragHandleDots2Icon className="size-6" />
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-bold">{question.label}</h2>
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <span className="font-medium">{getTypeLabel(question.type)}</span>
          {question.required && <span className="text-red-500">Påkrevd</span>}
        </div>
        {question.description && (
          <p className="text-muted-foreground mt-1 text-sm">{question.description}</p>
        )}
        {options.length > 0 && (
          <div className="mt-2">
            <span className="text-muted-foreground text-sm font-medium">Alternativer: </span>
            <span className="text-muted-foreground text-sm">{options.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDeleteQuestion}
          className="text-gray-600 hover:text-red-600"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};
