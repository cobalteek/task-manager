export default defineEventHandler(async (event) => {

  deleteCookie(event, 'token', {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return { success: true }

})
