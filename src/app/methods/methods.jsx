"use client";

export async function handleSubmitMethod(route,body,url,router){

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}${route}`, {
        credentials: 'include',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
        if (!response.ok) {
        throw new Error(`error: ${response.message})`);
    }
    
    // Ensure the content type of the response is application/json before parsing
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        router.push(`/${url}`);
        return data;
    } else {
        throw new Error("Received non-JSON response from server");
    }
    
    };
