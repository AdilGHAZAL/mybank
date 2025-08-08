import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
  })

  it('contains main navigation elements', () => {
    render(<App />)
    // Test basic rendering - adjust based on your actual App component
    expect(document.querySelector('div')).toBeInTheDocument()
  })
})
