import axios from "axios";
import { user } from "../stores";

export class BeerconomyService {
  baseUrl = "";

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    const beerconomyCredentials = localStorage.beerconomy;
    if (beerconomyCredentials) {
      const savedUser = JSON.parse(beerconomyCredentials);
      user.set({
        email: savedUser.email,
        token: savedUser.token,
      });
      axios.defaults.headers.common["Authorization"] = "Bearer " + savedUser.token;
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email, password });
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      if (response.data.success) {
        user.set({
          email: email,
          token: response.data.token,
        });
        localStorage.beerconomy = JSON.stringify({ email: email, token: response.data.token });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async checkTokenExpired(token) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/profile/checkToken`, token);
      return response.data;
    } catch (error) {
      return true;
    }
  }

  async logout() {
    user.set({
      email: "",
      token: "",
    });
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("beerconomy");
  }

  async addUser(user) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users`, user);
      if (response.status == 200) {
        return true;
      }
      return false   
    } catch (error) {
      return false;
    }
  }

  async addPlace(place) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/places`, place);
      if (response.status == 200) {
        return true;
      } else {
        return false
      }
    } catch (error) {
      return false;
    }
  }

  async addPlacePhoto(id, photo) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/places/${id}/photos`, photo, { headers: { "Content-Type": photo.type } });
      return response.status == 200;
    } catch (error) {
      return false;
    }
  }

  async likeReview(id, like) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/likes/${id}`, like);
      if (response.status == 200) {
        return true
      }
      return false;
    } catch (error) {
      return [];
    }
  }

  async getPlaceReviews(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/places/${id}/reviews`);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getLikes(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/likes/${id}`);
      if (response.status == 200) {
        return response.data.length
      }
      return 0;
    } catch (error) {
      return [];
    }
  }

  async addReview(review) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/reviews`, review);
      if (response.status == 200) {
        return true;
      } 
      return false
    } catch (error) {
      return [];
    }
  }

  async getAllReviews() {
    try {
      const response = await axios.get(this.baseUrl + "/api/reviews");
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async deleteReview(id) {
    try {
      const response = await axios.delete(`${this.baseUrl}/api/reviews/${id}`);
      return response.data;
    } catch (error) {
      return false;
    }
  }

  async getAllPlaces() {
    try {
      const response = await axios.get(this.baseUrl + "/api/places");
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getPlaceLatLng(lat, lng) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/places/lat=${lat}lng=${lng}`);
      //console.log(response.data)
      return response.data;
    } catch (error) {
      return {};
    }
  }

  async getWeather(lat, lng) {
    try {
      // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${ApiKey}
      const response = await axios.get(`${this.baseUrl}/api/weather/lat=${lat}lng=${lng}`)
      console.log(response.data)
      return response.data;
    } catch (error) {
      return {};
    }
  }

  async getProfilePicture(userEmail) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/profile/profilepicture`);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async updateProfilePicture(profilePicture) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/profile/profilepicture`, profilePicture, { headers: { "Content-Type": profilePicture.type } });
      return response.data;
    } catch (error) {
      return false;
    }
  }

  async updateProfile(newDetails) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/profile`, newDetails);
      return response.status == 200;
    } catch (error) {
      return false;
    }
  }

  async getProfile() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/profile`);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getProfileReviews() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/profile/reviews`);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getUserProfile(userId) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/users/${userId}/getuserprofile`);
      return response.data;
    } catch (error) {
      return {};
    }
  }
}
