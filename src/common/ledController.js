export const ledController = {
    getIsbn: async function(isbn) {
      try {
        const response = await fetch('http://192.168.10.118:8001/getIsbn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isbn })
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching ISBN:', error);
      }
    },
  
    setLeds: async function(start, end, color) {

        console.log( JSON.stringify({
            start,
            stop: end,
            color
          }));
      try {
        const response = await fetch('http://192.168.10.118:8001/setLeds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            start,
            stop: end,
            color
          }),
        //   mode: 'no-cors',
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error setting LEDs:', error);
      }
    }
  };
  