package family.themartinez.mealplanner.data.ingredients;

import com.google.common.collect.ImmutableList;
import com.vladmihalcea.hibernate.type.json.JsonType;
import family.themartinez.mealplanner.data.converters.ImmutableListConverter;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

@TypeDefs({@TypeDef(name = "json", typeClass = JsonType.class)})
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

  @Column(name = "aisle", columnDefinition = "json")
  @Convert(converter = ImmutableListConverter.class)
  private ImmutableList<String> aisle;

  @Column(name = "categories", columnDefinition = "json")
  @Convert(converter = ImmutableListConverter.class)
  private ImmutableList<String> categories;

  @Column(name = "image")
  private String image;

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public ImmutableList<String> getCategories() {
    return categories;
  }

  public void setCategories(ImmutableList<String> categories) {
    this.categories = categories;
  }

  public ImmutableList<String> getAisle() {
    return aisle;
  }

  public void setAisle(ImmutableList<String> aisle) {
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
