'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext, useFormState } from 'react-hook-form';
import { Label } from '@/components/ui/label';

const Form = FormProvider;

const FormFieldContext = React.createContext<{ name: string }>({} as any);

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldComponetContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState();

  if (!fieldComponetContext) throw new Error('useFormField should be used within <FormField>');

  const { name } = fieldComponetContext;
  const fieldState = getFieldState(name, formState);
  const id = itemContext?.id || name;

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItemContext = React.createContext<{ id: string }>({} as any);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className="space-y-2" {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField();
  return <Label ref={ref} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;
  if (!body) return null;

  return (
    <p ref={ref} id={formMessageId} className="text-sm font-medium text-red-500" {...props}>
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export { Form, FormItem, FormLabel, FormControl, FormMessage, FormField, useFormField };