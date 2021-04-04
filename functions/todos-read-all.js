/* Import faunaDB sdk */
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = async (event, context) => {
  
  return await client.query(q.Paginate(q.Match(q.Ref('indexes/all_todos'))))
    .then( async (response) => {
      const todoRefs = response.data
  
      // create new query out of todo refs. http://bit.ly/2LG3MLg
      const getAllTodoDataQuery = todoRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return await client.query(getAllTodoDataQuery).then((ret) => {
  //   ret = ret.map(el=>el=el.ref["@ref"])
        console.log(ret)
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        }
      })
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
    
}
