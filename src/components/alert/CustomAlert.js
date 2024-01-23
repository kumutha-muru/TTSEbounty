import React from 'react'
import { Alert } from '@mui/material'
import {useTranslation} from "react-i18next";

const CustomAlert = (props) => {
    const { type, text } = props
    const {t} = useTranslation()
    return (
        <Alert severity={type} sx={{ textTransform: 'none' }} style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
        }}>
            {t(text)}
        </Alert>
    )
}

CustomAlert.propTypes = {}

export default CustomAlert
