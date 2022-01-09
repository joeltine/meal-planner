package family.themartinez.mealplanner.data.ingredients;

import family.themartinez.mealplanner.data.converters.JSONArrayConverter;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import org.json.JSONArray;

@Entity
@Table(name = "ingredients")
public class Ingredient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "api_id")
  private Integer apiId;

  @Column(name = "aisle")
  @Convert(converter = JSONArrayConverter.class)
  private JSONArray aisle;

  @Column(name = "categories")
  @Convert(converter = JSONArrayConverter.class)
  private JSONArray categories;

  @Column(name = "image")
  private String image;

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public JSONArray getCategories() {
    return categories;
  }

  public void setCategories(JSONArray categories) {
    this.categories = categories;
  }

  public JSONArray getAisle() {
    return aisle;
  }

  public void setAisle(JSONArray aisle) {
    this.aisle = aisle;
  }

  public Integer getApiId() {
    return apiId;
  }

  public void setApiId(Integer apiId) {
    this.apiId = apiId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }
}
