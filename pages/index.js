import React from 'react'
import Link from 'next/link';
export default function Index() {
    const [showToast, setShowToast] = React.useState({ show: false, message: '', });
    const [users, setUsers] = React.useState([]);
    const handleAddNewUser = async (e) => {
        e.preventDefault();
        let name = (e.target.name.value)?.toString().trim();
        let phone = (e.target.phone.value)?.toString().trim();
        try {
            let result  = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone }),
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
    React.useEffect(()=> {
        (async () => {
            let result = await fetch(`/api/get-all-users`, { 
                method: 'GET',
                headers: {
                    "Content-type": 'application/json',
                }
            });
            result = await result.json();
            setUsers(result.users);
        })()
    }, [])
    return (
        <div className='grid grid-cols-[2fr,1fr] gap-3 h-full min-h-screen '>
            <div className='flex flex-col items-center justify-center min-h-screen h-full'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='text-center font-bold mb-4'>Please enter the name of the new user</div>
                    <form action="/users" method="POST" onSubmit={handleAddNewUser}>
                        <input required placeholder='Name' className='p-2 border border-red-200 rounded-lg h-12 mr-2' type="text" name="name"  />
                        <input required placeholder='Phone' className='p-2 border border-red-200 rounded-lg h-12 mr-2'  type="tel" name="phone"/>
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
            <div className='sticky top-20 flex flex-col items-start p-20 gap-1'>
                { users.length > 0 && users.map(item => <Link href={`/${item.uri}`} key={item._id}>
                    <div className='flex flex-col p-10 w-full bg-gray-100 hover:bg-blue-100 cursor-pointer rounded-md'>
                        <div>name: { item.name }</div>
                        <div>phone: { item.phone}</div>
                        <div>uri: { item.uri }</div>
                        <div>is visit app: { item.firebase_token && item.firebase_token !== null ? 'YES': 'NO'}</div>
                    </div>
                </Link>)}
            </div>
        </div>
    )
}
