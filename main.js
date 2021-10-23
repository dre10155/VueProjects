
var eventBus = new Vue()

Vue.component('product-tabs',{
    template:`
        <div>
            <span
             class="tab"
             :class="{activeTab: selectedTab === tab}"
             v-for="(tab, index) in tabs" 
             :key="index"
             @click="selectedTab = tab">
             {{tab}}
             </span>
            
    
             <div v-show="selectedTab === 'Review'" >
                 <h2>Review</h2>
                 <p v-if="!reviews.length">No Reviews as yet.</p>
               <ul>
                 <li v-for="review in reviews ">
                      <p>{{review.name}}</p>
                      <p>{{review.rating}}</p>
                      <p>{{review.review}}</p>
                 </li>
             </ul>
             <product-review></product-review>
             </div>
            

        </div>
    `,
    props:{
        reviews:{
            type:Array,
            required:true
        }

    },
    data(){
        return{
            tabs:["Review","Make a Review"],
            selectedTab:'Review'
        }
    }
})


Vue.component('product-review',{
    template:`
    <form class="review-form" @submit.prevent="onSubmit">
     <p>
        <label for="name">Name:</label>   
        <input v-model="name"/>
     </p>
     <p>
        <label for="review">Review:</label>   
        <textarea id="review"  v-model="review"/>
     </p>
     <p>
        <label for="rating">Rating:</label>   
        <select id="rating"  v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
     </p>
     <p>
       <input type="submit" value="Submit">
     </p>
    </form>

    `,
    data(){
        return{
            name:null,
            rating:null,
            review:null

        }
    },
    methods:{
        onSubmit(){
            let productReview = {
                name:this.name,
                review:this.review,
                rating:this.rating

            }
            eventBus.$emit('review-submitted', productReview)
            this.name=null
            this.review = null
            this.rating = null
        }
    }
})
Vue.component('product',{
    props:{
        premium:{
            type:Boolean,
            required:false
        }

    },

    template:` <div class="product">

    <div class="product-image">
      <img v-bind:src="image" />
    </div>
  
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else :class="{crossLine:!inStock}">Out of Stock</p>
      <p>{{shipping}}</p>
      <ul>
          <li v-for="detail in details">{{detail}}</li>
      </ul>
      <div v-for="(variant, index) in variants" 
           :key="variant.variantId"
           class="color-box"
           :style="{backgroundColor:variant.variantColor}"
           @mouseover="updateProduct(index)"
           >
      </div>
      <button 
      v-on:click="addToCart"
       :disabled="!inStock" 
       :class="{disabledButton:!inStock}"
       >Add to Cart
    </button>
    <button @click="removeFromCart">Remove from Cart</button>
    </div>
    <product-tabs :reviews="reviews"></product-tabs>
    
</div>
    `,
    data(){
        return {
            product:'Socks',
            brand:'Vue Mastery',
            selectedVariant: 0,
            link:'https://www.tradingview.com/',
            details:["80% cotton", "20% polyester","Gender-neutral"],
            variants:[
                {
                    variantId:"2234",
                    variantColor:"green",
                    variantImage:"./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity:10
                },
                {
                    variantId:"2235",
                    variantColor:"blue",
                    variantImage:"./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity:20 
    
                }
    
            ] ,
            reviews:[]
        }
        
    },

    computed:{
        title(){
            return this.brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping(){
            if(this.premium){
                return `Free Shipping`
            }else{
                return `No Discount`
            }

        }
    },
    mounted(){
        eventBus.$on('review-submitted',productReview =>{
            this.reviews.push(productReview)
        })

    },
    methods:{
        addToCart(){
         this.$emit('update-cart',this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index){
            this.selectedVariant = index
        },
        removeFromCart(){
            this.$emit('remove-from-cart',this.variants[this.selectedVariant].variantId)
        }
    }
})

var app = new Vue({
    el:'#app',
    data:{
        premium:true,
        cart:[]
    },
    methods:{
        updateCart(id){
            return this.cart.push(id)
        },
        removeItem(id){
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                   this.cart.splice(i, 1);
                }
              }
        }
    }
    
})