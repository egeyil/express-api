import { z } from 'zod'

const genericSchema = {
  genericString: z.string().min(0).max(5000),
  genericEmail: z.string().email().min(0).max(70),
  genericUuid: z.string().uuid(),
}

export default genericSchema;