// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import '../src/i18n'
import App from '../src/App'
import { TOOLS } from '../src/tools/registry'

describe('app smoke', () => {
  it('renders the home page with the hero title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Geliştiriciler için çevrimdışı araç kutusu',
    )
  })

  it('lists every registered tool as a navigable link', () => {
    render(<App />)
    const nav = screen.getAllByRole('navigation')[0]
    for (const tool of TOOLS) {
      const links = within(nav).getAllByText(
        (_, el) => el?.tagName === 'A' && el.getAttribute('href') === `#/tool/${tool.id}`,
      )
      expect(links.length).toBeGreaterThan(0)
    }
  })

  it('navigates to a tool and renders its lazy-loaded body', async () => {
    render(<App />)
    const link = document.querySelector('a[href="#/tool/base64"]') as HTMLElement
    fireEvent.click(link)
    await waitFor(() => expect(document.querySelector('textarea')).toBeTruthy())
    expect(document.body.textContent).toContain('Base64')
  })
})
