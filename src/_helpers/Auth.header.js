import React from 'react'

export default function authHeader(isFile = false) {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("userDetails"));
    } catch (e) {
        console.error("Failed to parse user details from localStorage:", e);
    }

    if (user && user.token) {
        if (isFile) {
            return {
                'Authorization': `Bearer ${user.token}`
            };
        } else {
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            };
        }
    } else {
        return {};
    }
}
