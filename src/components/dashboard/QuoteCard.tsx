import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useStoicQuote } from "@/lib/stoic-quote"

function wikipediaAuthorSearchUrl(author: string): string {
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(author)}`
}

export function QuoteCard() {
  const { text, author } = useStoicQuote()

  return (
    <article className="glass-card rounded-xl p-10 flex flex-col justify-center min-h-[280px]">
      <h2 className={`${dashboardSectionLabelClassName} mb-6`}>
        Quote of the day
      </h2>
      <blockquote>
        <p className="text-2xl sm:text-3xl md:text-4xl leading-tight font-medium tracking-tight text-muted-foreground/80">
          &ldquo;{text}&rdquo;
        </p>
        <footer className="mt-6 text-[0.6875rem] font-semibold tracking-[0.12em] text-primary uppercase">
          —{" "}
          <a
            href={wikipediaAuthorSearchUrl(author)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {author}
          </a>
        </footer>
      </blockquote>
    </article>
  )
}
