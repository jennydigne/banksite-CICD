import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Account from '@/app/account/page'

describe('Account', () => {
    it('renders a component', () => {
        const result = render(<Account />)

        const saldoText = screen.getByText('Hem')

        expect(saldoText).toBeInTheDocument()
    })
})
