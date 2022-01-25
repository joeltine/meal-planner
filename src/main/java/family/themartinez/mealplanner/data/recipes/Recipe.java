package family.themartinez.mealplanner.data.recipes;

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
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

@TypeDefs({@TypeDef(name = "json", typeClass = JsonType.class)})
@Entity
@Table(name = "recipes")
public class Recipe {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "name", nullable = false)
  private String name;

  @Type(type = "text")
  @Column(name = "instructions", nullable = false)
  private String instructions;

  @Type(type = "text")
  @Column(name = "description")
  private String description;

  @Column(name = "external_link", length = 2048)
  private String externalLink;

  @Column(name = "prep_time_min", nullable = false)
  private Integer prepTimeMin;

  @Column(name = "cook_time_min", nullable = false)
  private Integer cookTimeMin;

  @Column(name = "categories", columnDefinition = "json")
  @Convert(converter = ImmutableListConverter.class)
  private ImmutableList<String> categories;

  public ImmutableList<String> getCategories() {
    return categories;
  }

  public void setCategories(ImmutableList<String> categories) {
    this.categories = categories;
  }

  public Integer getCookTimeMin() {
    return cookTimeMin;
  }

  public void setCookTimeMin(Integer cookTimeMin) {
    this.cookTimeMin = cookTimeMin;
  }

  public Integer getPrepTimeMin() {
    return prepTimeMin;
  }

  public void setPrepTimeMin(Integer prepTimeMin) {
    this.prepTimeMin = prepTimeMin;
  }

  public String getExternalLink() {
    return externalLink;
  }

  public void setExternalLink(String externalLink) {
    this.externalLink = externalLink;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getInstructions() {
    return instructions;
  }

  public void setInstructions(String instructions) {
    this.instructions = instructions;
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
