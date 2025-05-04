exports.handler = async (event, context) => {
    const { username } = event.queryStringParameters;
    
    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username is required' })
      };
    }
  
    try {
      const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
      
      if (!response.ok) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Username not found' })
        };
      }
  
      const data = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch UUID' })
      };
    }
  };