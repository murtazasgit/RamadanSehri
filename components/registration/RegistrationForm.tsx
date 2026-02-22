'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Modal } from '../ui/Modal'
import { getPGById, generateRequestId } from '../../lib/constants'
import { checkDuplicatePhone, saveRequest } from '../../lib/store'
import { Check, Minus, Plus, Copy } from 'lucide-react'

const listedPGSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  roomNumber: z.string().optional(),
  peopleCount: z.number().min(1, 'At least 1 person').max(50),
  notes: z.string().optional(),
})

const othersSchema = z.object({
  pgName: z.string().min(3, 'PG name must be at least 3 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  address: z.string().min(10, 'Please provide full address'),
  peopleCount: z.number().min(1, 'At least 1 person').max(50),
  landmark: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof listedPGSchema> | z.infer<typeof othersSchema>

interface RegistrationFormProps {
  pgId: string
}

export function RegistrationForm({ pgId }: RegistrationFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [requestId, setRequestId] = useState('')
  const [submitError, setSubmitError] = useState('')
  const pg = getPGById(pgId)
  const isOthers = pgId === 'others'

  const schema = isOthers ? othersSchema : listedPGSchema

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      peopleCount: 1,
    } as FormData,
  })

  const peopleCount = watch('peopleCount')

  const incrementPeople = () => {
    if (peopleCount < 50) {
      setValue('peopleCount', peopleCount + 1)
    }
  }

  const decrementPeople = () => {
    if (peopleCount > 1) {
      setValue('peopleCount', peopleCount - 1)
    }
  }

  const onSubmit = async (data: any) => {
    setSubmitError('')

    if (checkDuplicatePhone(data.phone)) {
      setSubmitError('This phone number is already registered for Sehri')
      return
    }

    const newRequestId = generateRequestId()
    
    const requestData = {
      pgId,
      pgName: isOthers ? data.pgName : pg?.name || '',
      fullName: data.fullName,
      phone: data.phone,
      roomNumber: data.roomNumber,
      address: isOthers ? data.address : pg?.address || '',
      peopleCount: data.peopleCount,
      landmark: data.landmark,
      notes: data.notes,
      isOthers,
      requestId: newRequestId,
    }

    saveRequest(requestData)
    setRequestId(newRequestId)
    setShowSuccess(true)
  }

  const copyRequestId = () => {
    navigator.clipboard.writeText(requestId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass rounded-2xl p-6 sm:p-8">
        <h2 className="font-heading text-2xl text-text-primary mb-2">
          {isOthers ? 'Register New PG' : `Register for ${pg?.name}`}
        </h2>
        <p className="text-text-secondary mb-6">
          {isOthers ? 'Enter your PG details below' : 'Fill in your details for Sehri'}
        </p>

        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {isOthers && (
            <Input
              label="PG Name"
              placeholder="Enter your PG name"
              {...register('pgName')}
              error={(errors as any).pgName?.message as string}
              required
            />
          )}

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            {...register('fullName')}
            error={(errors as any).fullName?.message as string}
            required
          />

          <Input
            label="Phone Number"
            placeholder="10-digit mobile number"
            type="tel"
            maxLength={10}
            {...register('phone')}
            error={(errors as any).phone?.message as string}
            required
          />

          {!isOthers && (
            <Input
              label="Room Number"
              placeholder="e.g., 101, A-205"
              {...register('roomNumber')}
              error={(errors as any).roomNumber?.message as string}
            />
          )}

          {isOthers && (
            <Input
              label="Full Address"
              placeholder="Complete address with street name"
              {...register('address')}
              error={(errors as any).address?.message as string}
              required
            />
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Number of People <span className="text-accent">*</span>
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={decrementPeople}
                className="w-12 h-12 rounded-lg bg-background-tertiary border border-border flex items-center justify-center text-text-primary hover:bg-primary/20 hover:border-primary transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center">
                <span className="font-heading text-3xl text-accent">{peopleCount}</span>
                <p className="text-text-secondary text-sm">
                  {peopleCount === 1 ? 'Person' : 'People'}
                </p>
              </div>
              <button
                type="button"
                onClick={incrementPeople}
                className="w-12 h-12 rounded-lg bg-background-tertiary border border-border flex items-center justify-center text-text-primary hover:bg-primary/20 hover:border-primary transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.peopleCount && (
              <p className="mt-2 text-sm text-red-400">{errors.peopleCount.message as string}</p>
            )}
          </div>

          {isOthers && (
            <Input
              label="Landmark"
              placeholder="Nearby famous place"
              {...register('landmark')}
              error={(errors as any).landmark?.message as string}
            />
          )}

          <Textarea
            label="Additional Notes"
            placeholder="Any special requirements..."
            rows={3}
            {...register('notes')}
            error={(errors as any).notes?.message as string}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isSubmitting}
          >
            Submit Sehri Request
          </Button>
        </form>
      </div>

      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
          <h3 className="font-heading text-2xl text-text-primary mb-2">
            Request Received!
          </h3>
          <p className="text-text-secondary mb-4">
            Your Sehri request has been registered successfully.
          </p>
          <p className="text-arabic text-xl text-accent mb-2" dir="rtl">
            جَزَاكَ اللهُ خَيْرًا
          </p>
          <p className="text-text-secondary text-sm mb-6">
            JazakAllah Khair
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-text-secondary">Request ID:</span>
            <code className="bg-background-tertiary px-3 py-1 rounded text-accent font-mono">
              {requestId}
            </code>
            <button
              onClick={copyRequestId}
              className="p-1 hover:bg-background-tertiary rounded transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          <Button onClick={() => setShowSuccess(false)}>
            Done
          </Button>
        </div>
      </Modal>
    </motion.div>
  )
}
