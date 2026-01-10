import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from './ui/input-group'
import { Textarea } from './ui/textarea'
import type { RecipeForm } from '@/hooks/use-recipe-form'

type InputValue = string | number | undefined

type InputFieldName<TForm> = {
  [K in keyof TForm]: TForm[K] extends InputValue ? K : never
}[keyof TForm] &
  string

type TextFieldProps = {
  form: RecipeForm
  name: InputFieldName<RecipeForm['state']['values']>
  label: string
} & Omit<React.ComponentProps<'input'>, 'form' | 'name'>

type TextAreaFieldProps = {
  form: RecipeForm
  name: InputFieldName<RecipeForm['state']['values']>
  label: string
} & Omit<React.ComponentProps<'textarea'>, 'form' | 'name'>

type FieldTextInputProps = {
  field: any
  type?: 'text' | 'number'
} & Omit<React.ComponentProps<'input'>, 'form' | 'name'>

type FieldTextAreaInputProps = {
  field: any
} & Omit<React.ComponentProps<'textarea'>, 'form' | 'name'>

export function TextField({
  form,
  name,
  label,
  type = 'text',
  placeholder,
}: TextFieldProps) {
  return (
    <form.Field name={name}>
      {(field) => {
        const invalid = field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={invalid}>
            <FieldLabel>{label}</FieldLabel>
            <Input
              type={type}
              placeholder={placeholder}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  type === 'number' ? Number(e.target.value) : e.target.value,
                )
              }
            />
            {invalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    </form.Field>
  )
}

export function TextAreaField({
  form,
  name,
  label,
  placeholder,
  maxLength,
  ...others
}: TextAreaFieldProps) {
  return (
    <form.Field name={name}>
      {(field) => {
        const invalid = field.state.meta.isTouched && !field.state.meta.isValid

        const value = field.state.value ?? ''

        return (
          <Field data-invalid={invalid}>
            <FieldLabel>{label}</FieldLabel>

            <InputGroup>
              <InputGroupTextarea
                placeholder={placeholder}
                value={value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                {...others}
              />

              {maxLength && (
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {(value as string).length}/{maxLength} characters
                  </InputGroupText>
                </InputGroupAddon>
              )}
            </InputGroup>

            {invalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    </form.Field>
  )
}

export function FieldTextInput({
  field,
  type = 'text',
  placeholder,
}: FieldTextInputProps) {
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={invalid}>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) =>
          field.handleChange(
            type === 'number' ? Number(e.target.value) : e.target.value,
          )
        }
      />
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function FieldTextAreaInput({
  field,
  placeholder,
}: FieldTextAreaInputProps) {
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={invalid}>
      <Textarea
        id={field.name}
        name={field.name}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
