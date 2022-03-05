import React from 'react'

export default function Index() {
    const [showToast, setShowToast] = React.useState({ show: false, message: '', })
    const handleAddNewUser = async (e) => {
        e.preventDefault();
        try {
            let result  = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: e.target.name.value,
                    phone: e.target.phone.value
                })
            })
            let data = await result.json();
            if(data.done){
                setShowToast({ show: true, message: 'User added successfully ✅', });
            } else {
                setShowToast({ show: true, message: 'User not added ❌', });
            }
        } catch (error) {
            setShowToast({ show: true, message: 'There was an error, please try again ⛔️', })
        }
    }
    return (
        <div className='flex flex-col items-center justify-center min-h-screen h-full'>
            <div className='flex flex-col items-center justify-center'>
                <div className='text-center font-bold mb-4'>Please enter the neme of the new user</div>
                <form action="/users" method="POST" onSubmit={handleAddNewUser}>
                    <input className='p-2 border border-red-200 rounded-lg h-12 mr-2' type="text" name="name"  />
                    <input className='p-2 border border-red-200 rounded-lg h-12 mr-2'  type="tel" name="phone"/>
                    <button className='bg-red-100 rounded-lg border border-red-200 h-12 py-2 px-5' type="submit">Submit</button>
                </form>
            </div>
            {
                showToast.show &&
                    <div
                        className='text-center fixed left-1/2 transform -translate-x-1/2 bottom-4 transition-all ease-out text-red-500 rounded-lg bg-white shadow-lg px-5 py-3 font-bold'
                        onClick={() => setShowToast({ show: false, message: '', })}
                    >{showToast.message}</div>
            }
        </div>
    )
}
