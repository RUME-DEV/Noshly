import { useState } from 'react'

function usePasswordVisibility() {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(prev => !prev)
    }

    return {
        visible,
        toggleVisibility,
    }
}

export default usePasswordVisibility