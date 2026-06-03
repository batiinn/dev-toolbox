import cronstrue from 'cronstrue'
import 'cronstrue/locales/tr'
import { CronExpressionParser } from 'cron-parser'

export function explainCron(expression: string, locale: 'tr' | 'en' = 'tr'): string {
  return cronstrue.toString(expression.trim(), {
    locale,
    use24HourTimeFormat: true,
    throwExceptionOnParseError: true,
  })
}

export function nextCronRuns(expression: string, count = 5, from = new Date()): Date[] {
  const interval = CronExpressionParser.parse(expression.trim(), { currentDate: from })
  const runs: Date[] = []
  for (let i = 0; i < count; i++) runs.push(interval.next().toDate())
  return runs
}
