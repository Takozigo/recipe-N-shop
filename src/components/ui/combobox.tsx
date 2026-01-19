'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function Combobox({
  data,
  onSelect,
}: {
  onSelect: (d: { dataId?: string; value: string }) => void
  data: Array<{
    lang?: string
    value: string
    id: string
  }>
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const hasExactMatch = data.some(
    (i) => i.value.toLowerCase() === value.toLowerCase(),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-50 justify-between"
        >
          {value ? value : 'Select...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            onValueChange={(v) => setValue(v)}
          />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {data.map((d) => (
                <CommandItem
                  key={d.value}
                  value={d.value}
                  onSelect={() => {
                    onSelect({
                      dataId: d.id,
                      value: d.value,
                    })
                    setOpen(false)
                  }}
                >
                  {d.value}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === d.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {!hasExactMatch && value.length > 0 && (
              <CommandItem
                value={value}
                onSelect={() => {
                  onSelect({
                    value,
                  })
                  setOpen(false)
                }}
              >
                ➕ Add "{value}"
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
