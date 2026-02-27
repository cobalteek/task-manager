export default defineEventHandler(async (event) => {

  deleteCookie(event, 'token', {
    path: '/',
  })

  return { success: true }

})
