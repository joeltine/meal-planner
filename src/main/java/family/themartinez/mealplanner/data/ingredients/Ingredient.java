package family.themartinez.mealplanner.data.ingredients;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

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

  // TODO: Convert these to List<String> automatically.
  // TODO: This JSON column stuff likely isn't working, test and fix.
  @Column(name = "aisle", columnDefinition = "json")
  private String aisle;

  @Column(name = "categories", columnDefinition = "json")
  private String categories;

  @Column(name = "image")
  private String image;

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public String getCategories() {
    return categories;
  }

  public void setCategories(String categories) {
    this.categories = categories;
  }

  public String getAisle() {
    return aisle;
  }

  public void setAisle(String aisle) {
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
